import { TRPCError } from "@trpc/server";
import { createTRPCRouter, roleProcedure } from "../../trpc";
import {
  createApartmentSchema,
  deleteApartmentSchema,
  editApartmentSchema,
} from "./validation";
import { db } from "@/server/db";
import { z } from "zod/v4";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import QRCode from "qrcode";
import { mergePdfs } from "@/lib/merge-pdfs";
import _ from "lodash";
import type { Prisma } from "@prisma/client";

export const apartmentsRouter = createTRPCRouter({
  create: roleProcedure(["admin", "moderator"])
    .input(createApartmentSchema)
    .mutation(async ({ input }) => {
      const isApartmentNumberAlreadyInUse = await db.apartment.findFirst({
        where: { apartmentNumber: input.apartmentNumber },
      });

      if (isApartmentNumberAlreadyInUse)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "رقم الشقة مسجل بالفعل، الرجاء اختيار رقم آخر.",
        });

      await db.apartment.create({
        data: {
          status: input.status,
          apartmentNumber: input.apartmentNumber,
          owners: {
            createMany: {
              data: input.owner,
            },
          },
          ...(input.renter.length > 0
            ? {
                renters: {
                  createMany: {
                    data: input.renter,
                  },
                },
              }
            : {}),
        },
      });
    }),
  edit: roleProcedure(["admin", "moderator"])
    .input(editApartmentSchema)
    .mutation(async ({ input }) => {
      // Fetch existing apartment including relational records
      const apartment = await db.apartment.findUnique({
        where: { id: input.id },
        include: {
          owners: true,
          renters: true,
        },
      });

      // Abort if the apartment does not exist
      if (!apartment)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "هذه الشقة غير موجودة في قاعدة البيانات",
        });

      /**
       * Validate uniqueness of apartmentNumber
       * - Only check if the number has changed
       */
      const isTheSameNumber =
        input.apartmentNumber === apartment.apartmentNumber;

      if (!isTheSameNumber) {
        const isApartmentNumberAlreadyInUse = await db.apartment.findFirst({
          where: { apartmentNumber: input.apartmentNumber },
        });

        if (isApartmentNumberAlreadyInUse)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "رقم الشقة مسجل بالفعل، الرجاء اختيار رقم آخر.",
          });
      }

      /**
       * Determine removed owners & renters
       * - Exists in DB but not in updated input
       */
      const deletedOwners = apartment.owners.filter(
        (owner) => !input.owner.some((o) => o?.id === owner.id),
      );
      const deletedRenters = apartment.renters.filter(
        (renter) => !input.renter.some((r) => r?.id === renter.id),
      );

      // Physically remove deleted relational records
      await db.owner.deleteMany({
        where: { id: { in: deletedOwners.map((owner) => owner.id) } },
      });
      await db.renter.deleteMany({
        where: { id: { in: deletedRenters.map((renter) => renter.id) } },
      });

      /**
       * Determine newly created relations
       * - Items without an ID = not in DB yet
       */
      const createdOwners = input.owner.filter((owner) => !("id" in owner));
      const createdRenters = input.renter.filter((renter) => !("id" in renter));

      /**
       * Determine updated relations
       * - Items still exist but changed from DB values
       */
      const updatedOwners = input.owner.filter((owner) => {
        const ownerRecord = apartment.owners.find((o) => o.id === owner?.id);
        if (!ownerRecord) return false;
        if (_.isEqual(ownerRecord, owner)) return false;
        return true;
      });

      const updatedRenters = input.renter.filter((renter) => {
        const renterRecord = apartment.renters.find((r) => r.id === renter?.id);
        if (!renterRecord) return false;
        if (_.isEqual(renterRecord, renter)) return false;
        return true;
      });

      /**
       * Final update:
       * - Update apartment basic fields
       * - Cascade create/update on relations
       */

      const conditionalData: Prisma.ApartmentUpdateInput = {};

      const createdOwnersIsEmpty = createdOwners.length <= 0;
      const updatedOwnersIsEmpty = updatedOwners.length <= 0;

      if (!createdOwnersIsEmpty) {
        conditionalData.owners = {};

        if (!createdOwnersIsEmpty)
          conditionalData.owners.createMany = {
            data: createdOwners,
          };
      }

      const createdRentersIsEmpty = createdRenters.length <= 0;
      const updatedRentersIsEmpty = updatedRenters.length <= 0;

      if (!createdRentersIsEmpty) {
        conditionalData.renters = {};

        if (!createdRentersIsEmpty)
          conditionalData.renters.createMany = {
            data: createdRenters,
          };
      }

      if (!updatedOwnersIsEmpty)
        for (const { id, ...updatedOwner } of updatedOwners)
          await db.owner.update({
            where: { id: id },
            data: { ...updatedOwner },
          });

      if (!updatedRentersIsEmpty)
        for (const { id, ...updatedOwner } of updatedOwners)
          await db.owner.update({
            where: { id: id },
            data: { ...updatedOwner },
          });

      await db.apartment.update({
        where: { id: input.id },
        data: {
          status: input.status,
          apartmentNumber: input.apartmentNumber,
          ...conditionalData,
        },
      });
    }),
  delete: roleProcedure(["admin", "moderator"])
    .input(deleteApartmentSchema)
    .mutation(async ({ input }) => {
      await db.apartment.deleteMany({
        where: { id: { in: input.map(({ id }) => id) } },
      });
    }),
  qrPdf: roleProcedure(["admin", "moderator"])
    .input(
      z.array(z.object({ qrData: z.string(), apartmentNumber: z.number() })),
    )
    .mutation(async ({ input }) => {
      const viewport = {
        deviceScaleFactor: 1,
        hasTouch: false,
        height: 1080,
        isLandscape: true,
        isMobile: false,
        width: 1920,
      };
      const browser = await puppeteer.launch({
        args: puppeteer.defaultArgs({ args: chromium.args, headless: "shell" }),
        defaultViewport: viewport,
        executablePath: await chromium.executablePath(),
        headless: "shell",
      });

      const pdfBuffers: Uint8Array<ArrayBufferLike>[] = [];

      for (const data of input) {
        const qrPng = await QRCode.toDataURL(data.qrData); // generates base64 PNG
        const page = await browser.newPage();
        await page.setContent(
          `
        <html>
          <head>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap" rel="stylesheet">
          </head>
          <body style="display:flex;align-items:center;justify-content:center;" dir="rtl">
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;">
              <p style="font-size:50px;font-family:Almarai,Almarai Fallback;font-style: normal;font-weight:bold;">شقة رقم: ${data.apartmentNumber}</p>
              <img src="${qrPng}" width="500" height="500" />
            </div>
          </body>
        </html>
      `,
          { waitUntil: "networkidle0" },
        );

        const pdf = await page.pdf({
          format: "A4",
          printBackground: true,
        });

        pdfBuffers.push(pdf);

        await page.close();
      }

      await browser.close();

      const mergedPDFs = await mergePdfs(pdfBuffers);

      // Return base64 instead of raw Buffer so tRPC can serialize
      return {
        pdf: Buffer.from(mergedPDFs).toString("base64"),
      };
    }),
});
