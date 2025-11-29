import { z } from "zod/v4";
import { createTRPCRouter, roleProcedure } from "../../trpc";
import { setGlobalValue } from "@/lib/global-values";

export const systemRouter = createTRPCRouter({
  settings: roleProcedure(["admin"])
    .input(z.object({ monthlyFee: z.number() }))
    .mutation(async ({ input }) => {
      await setGlobalValue("monthlyFee", input.monthlyFee);
    }),
});
