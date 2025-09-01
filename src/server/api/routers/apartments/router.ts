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
          isRented: input.rented,
          isOccupied: input.occupied,
          ownerName: input.owner.name,
          ownerPhone: input.owner.phone,
          apartmentNumber: input.apartmentNumber,
          occupantName: input.occupant?.name ?? null,
          occupantPhone: input.occupant?.phone ?? null,
        },
      });
    }),
  edit: roleProcedure(["admin", "moderator"])
    .input(editApartmentSchema)
    .mutation(async ({ input }) => {
      const apartment = await db.apartment.findUnique({
        where: { id: input.id },
      });

      const isTheSameNumber =
        input.apartmentNumber === apartment?.apartmentNumber;

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

      await db.apartment.update({
        where: { id: input.id },
        data: {
          isRented: input.rented,
          isOccupied: input.occupied,
          ownerName: input.owner.name,
          ownerPhone: input.owner.phone,
          apartmentNumber: input.apartmentNumber,
          occupantName: input.occupant?.name ?? null,
          occupantPhone: input.occupant?.phone ?? null,
        },
      });
    }),
  delete: roleProcedure(["admin", "moderator"])
    .input(deleteApartmentSchema)
    .mutation(async ({ input }) => {
      await db.apartment.delete({ where: { id: input.id } });
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
