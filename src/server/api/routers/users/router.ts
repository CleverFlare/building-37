import { z } from "zod/v4";
import { authedProcedure, createTRPCRouter, roleProcedure } from "../../trpc";
import { Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import { env } from "@/env";

export const usersRouter = createTRPCRouter({
  transferAdmin: roleProcedure(["admin"])
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const currentAdmin = await ctx.db.user.findFirst({
        where: { role: "admin" },
      });

      await ctx.db.user.update({
        where: { id: input.id },
        data: { role: "admin" },
      });

      if (currentAdmin)
        await ctx.db.user.update({
          where: { id: currentAdmin.id },
          data: { role: "moderator" },
        });
    }),

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
          data: { role: user.role },
        });
      }
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
    }),

  create: roleProcedure(["admin"])
    .input(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        username: z.string().min(3),
        email: z.email(),
        password: z.string().min(8),
        role: z.enum(["user", "moderator"]),
      }),
    )
    .mutation(async ({ input, ctx: { db } }) => {
      const { firstName, lastName, username, email, password, role } = input;

      // check existing username/email
      const existing = await db.user.findFirst({
        where: { OR: [{ username: username }, { email }] },
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "اسم المستخدم أو البريد الإلكتروني مستخدم بالفعل",
        });
      }

      const passwordHash = await bcrypt.hash(password, env.PASSWORD_SALT);

      const user = await db.user.create({
        data: {
          firstName,
          lastName,
          username,
          email,
          passwordHash,
          role,
        },
      });

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        role: user.role,
      };
    }),

  update: roleProcedure(["admin"])
    .input(
      z.object({
        id: z.string(),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        username: z.string().min(3),
        email: z.email(),
        password: z.string().min(8).optional(),
        role: z.enum(["user", "moderator"]),
      }),
    )
    .mutation(async ({ input, ctx: { db } }) => {
      const { id, firstName, lastName, username, email, password, role } =
        input;

      // check existing username/email
      const existing = await db.user.findFirst({
        where: { id },
      });

      if (!existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "هذا المستخدم غير مسجل بالنظام",
        });
      }

      const passwordHash = password
        ? await bcrypt.hash(password, env.PASSWORD_SALT)
        : null;

      const user = await db.user.update({
        where: { id },
        data: {
          firstName,
          lastName,
          username,
          email,
          ...(passwordHash !== null ? { passwordHash } : {}),
          role,
        },
      });

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        role: user.role,
      };
    }),

  updateProfile: authedProcedure
    .input(
      z.object({
        avatar: z.object({ key: z.string() }).nullable(),
        email: z.email(),
        firstName: z.string(),
        username: z.string(),
        lastName: z.string(),
      }),
    )
    .mutation(async ({ input, ctx: { db, session } }) => {
      const { firstName, lastName, username, email, avatar } = input;

      // check existing username/email
      const existing = await db.user.findUnique({
        where: { id: session.id },
      });

      if (!existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "هذا المستخدم غير مسجل بالنظام",
        });
      }

      const usernameUsed = await db.user.findUnique({ where: { username } });

      if (usernameUsed && usernameUsed.id !== session.id)
        throw new TRPCError({
          code: "CONFLICT",
          message: "إسم المستخدم مستخدم بالفعل",
        });

      const emailUsed = await db.user.findUnique({ where: { email } });

      if (emailUsed && emailUsed.id !== session.id)
        throw new TRPCError({
          code: "CONFLICT",
          message: "البريد الإلكتروني مستخدم بالفعل",
        });

      const user = await db.user.update({
        where: { id: session.id },
        data: {
          firstName,
          lastName,
          username,
          email,
          avatarKey: avatar ? avatar.key : null,
          avatarUrl: null,
        },
      });

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarKey: user.avatarKey,
        role: user.role,
      };
    }),
});
