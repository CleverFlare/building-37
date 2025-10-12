import { z } from "zod/v4";
import { createTRPCRouter, roleProcedure } from "../../trpc";

export const monthlyFeesRouter = createTRPCRouter({
  setMonthlyFee: roleProcedure(["admin"])
    .input(z.object({ monthlyFee: z.int() }))
    .mutation(async ({ input, ctx }) => {
      const isGlobalSet = await ctx.db.globalConfig.findFirst();

      if (!isGlobalSet) {
        await ctx.db.globalConfig.create({
          data: { monthlyFee: input.monthlyFee },
        });
      } else {
        await ctx.db.globalConfig.update({
          where: { id: isGlobalSet.id },
          data: { monthlyFee: input.monthlyFee },
        });
      }
    }),
});
