import { z } from "zod/v4";
import { createTRPCRouter, roleProcedure } from "../../trpc";
import { env } from "@/env";
import { TRPCError } from "@trpc/server";
import { setGlobalValue } from "@/lib/global-values";

export const monthlyFeesRouter = createTRPCRouter({
  setMonthlyFee: roleProcedure(["admin"])
    .input(z.object({ monthlyFee: z.int() }))
    .mutation(async ({ input }) => {
      await setGlobalValue("monthlyFee", input.monthlyFee);
    }),

  scanApartment: roleProcedure(["admin"])
    .input(
      z.object({
        apartmentNumber: z
          .string()
          .transform((v) => +v)
          .pipe(z.int()),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const globalConfig = await ctx.db.globalConfig.findFirst();

      const monthlyFee = globalConfig?.monthlyFee ?? env.DEFAULT_MONTHLY_FEE;

      const apartment = await ctx.db.apartment.findFirst({
        where: { apartmentNumber: input.apartmentNumber },
      });

      if (!apartment)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "رقم الشقة غير صحيح",
          cause: "invalid apartment",
        });

      // Get the current date
      const now = new Date();

      // Get the first day of the current month
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Get the first day of the next month (for exclusive upper bound)
      const startOfNextMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        1,
      );

      const isAlreadyScannedThisMonth = await ctx.db.monthlyFee.findFirst({
        where: {
          apartmentNumber: apartment.apartmentNumber,
          createdAt: {
            gte: startOfMonth,
            lt: startOfNextMonth,
          },
        },
      });

      if (isAlreadyScannedThisMonth) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "تم تسجيل دفع هذه الشقة بالفعل هذا الشهر.",
          cause: "duplicate",
        });
      }

      await ctx.db.monthlyFee.create({
        data: {
          apartmentNumber: apartment.apartmentNumber,
          ownerName: apartment.ownerName,
          ownerPhone: apartment.ownerPhone,
          renterName: apartment.renterName,
          renterPhone: apartment.renterPhone,
          state: apartment.state,
          paidAmount: monthlyFee,
        },
      });

      const today = new Date();

      await ctx.db.balance.upsert({
        where: { year: today.getFullYear() },
        update: { amount: { increment: monthlyFee } },
        create: {
          year: today.getFullYear(),
          month: today.getMonth(),
          amount: monthlyFee,
        },
      });
    }),
  delete: roleProcedure(["admin"])
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ input, ctx }) => {
      for (const id of input.ids) {
        try {
          const record = await ctx.db.monthlyFee.findUnique({ where: { id } });

          if (!record) continue;

          await ctx.db.monthlyFee.delete({ where: { id } });

          const today = new Date();

          await ctx.db.balance.upsert({
            where: { year: today.getFullYear() },
            update: { amount: { decrement: record.paidAmount } },
            create: {
              year: today.getFullYear(),
              month: today.getMonth(),
              amount: 0,
            },
          });
        } catch {
          throw new TRPCError({
            code: "UNPROCESSABLE_CONTENT",
            message: "عملية دفع غير موجودة",
          });
        }
      }
    }),
});
