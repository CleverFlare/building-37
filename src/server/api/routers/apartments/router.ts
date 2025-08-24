import { createTRPCRouter, roleProcedure } from "../../trpc";
import { createApartmentSchema } from "./validation";
import { db } from "@/server/db";

export const apartmentsRouter = createTRPCRouter({
  create: roleProcedure(["admin", "moderator"])
    .input(createApartmentSchema)
    .mutation(async ({ input }) => {
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
});
