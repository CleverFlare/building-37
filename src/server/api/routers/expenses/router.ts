import { z } from "zod/v4";
import { createTRPCRouter, roleProcedure } from "../../trpc";

export const expensesRouter = createTRPCRouter({
  create: roleProcedure(["admin"])
    .input(
      z.object({
        label: z.string().min(1),
        amount: z.int().positive(),
        month: z.int().min(0).max(11),
        year: z.int(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.expense.create({
        data: {
          label: input.label,
          amount: input.amount,
          month: input.month,
          year: input.year,
        },
      });
    }),

  delete: roleProcedure(["admin"])
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.expense.deleteMany({
        where: { id: { in: input.ids } },
      });
    }),
});
