import { z } from "zod/v4";
import { createTRPCRouter, roleProcedure } from "../../trpc";
import { Role } from "@prisma/client";

export const usersRouter = createTRPCRouter({
  updateRole: roleProcedure(["admin"])
    .input(z.array(z.object({ id: z.string(), role: z.enum(Role) })))
    .mutation(async ({ input, ctx }) => {
      for (const user of input) {
        // const userRecord = await ctx.db.user.findUnique({
        //   where: { id: user.id },
        // });

        // if (userRecord?.role === "admin") continue;

        await ctx.db.user.updateMany({
          where: { id: user.id },
          // eslint-disable-next-line
          data: { role: user.role },
        });
      }
      return true;
    }),

  deleteMany: roleProcedure(["admin"])
    .input(z.array(z.object({ id: z.string() })))
    .mutation(async ({ input, ctx }) => {
      let filteredInput = input;
      for (const user of input) {
        const userRecord = await ctx.db.user.findUnique({
          where: { id: user.id },
        });

        if (userRecord?.role === "admin") {
          filteredInput = input.filter((u) => u.id !== user.id);
        }
      }
      await ctx.db.user.deleteMany({
        where: { id: { in: filteredInput.map((u) => u.id) } },
      });
      return true;
    }),
});
