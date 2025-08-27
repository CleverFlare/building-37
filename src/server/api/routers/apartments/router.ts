import { TRPCError } from "@trpc/server";
import { createTRPCRouter, roleProcedure } from "../../trpc";
import {
  createApartmentSchema,
  deleteApartmentSchema,
  editApartmentSchema,
} from "./validation";
import { db } from "@/server/db";

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
});
