// server/auth.router.ts
import { z } from "zod";
import bcrypt from "bcrypt";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { createJwt } from "@/lib/create-jwt";
import { generateNumericOtp } from "@/lib/generate-numeric-otp";
import { TRPCError } from "@trpc/server";
import { sendOtpEmail } from "@/lib/send-otp-email";
import { env } from "@/env";
import { cookies } from "next/headers";

export const authRouter = createTRPCRouter({
  logout: publicProcedure.mutation(async () => {
    (await cookies()).set({
      name: "OutSiteJWT",
      value: "Hi there",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: -1,
    });
  }),
  // register
  register: publicProcedure
    .input(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        username: z.string().min(3),
        email: z.string().email(),
        password: z.string().min(8),
      }),
    )
    .mutation(async ({ input, ctx: { db } }) => {
      const { firstName, lastName, username, email, password } = input;

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

      const adminUser = await db.user.count({
        where: { role: { equals: "admin" } },
      });

      const passwordHash = await bcrypt.hash(password, env.PASSWORD_SALT);

      const user = await db.user.create({
        data: {
          firstName,
          lastName,
          username,
          email,
          passwordHash,
          ...(adminUser > 0 ? { role: "user" } : { role: "admin" }),
        },
      });

      const token = await createJwt({ sub: user.id, username: user.username });

      (await cookies()).set({
        name: "OutSiteJWT",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          avatarUrl: user.avatarUrl,
          role: "admin",
        },
        token,
      };
    }),

  // login
  login: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx: { db } }) => {
      const { username, password } = input;
      const user = await db.user.findUnique({ where: { username } });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "المستخدم غير موجود",
        });
      }

      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "بيانات تسجيل الدخول خاطئة",
        });
      }

      const token = await createJwt({ sub: user.id, username: user.username });

      (await cookies()).set({
        name: "OutSiteJWT",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          avatarUrl: user.avatarUrl,
          role: "admin",
        },
        token,
      };
    }),

  // forgot password -> send OTP
  forgotPassword: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(async ({ input, ctx: { db } }) => {
      const { email } = input;
      const user = await db.user.findUnique({ where: { email } });
      if (!user) {
        // Don't reveal whether email exists — return generic success message
        return { ok: true };
      }

      const otp = generateNumericOtp(6); // e.g. "839201"
      const otpHash = await bcrypt.hash(otp, 10);
      const otpExpires = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes

      await db.user.update({
        where: { id: user.id },
        data: { otpHash, otpExpires },
      });

      // send email (async)
      await sendOtpEmail({
        to: user.email,
        name: `${user.firstName} ${user.lastName}`,
        otp,
      });

      return { ok: true };
    }),

  // verify OTP (just check)
  verifyOtp: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        otp: z.string().min(4).max(8),
      }),
    )
    .mutation(async ({ input, ctx: { db } }) => {
      const { email, otp } = input;
      const user = await db.user.findUnique({ where: { email } });

      // eslint-disable-next-line
      if (!user || !user.otpHash || !user.otpExpires) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "OTP غير صالح" });
      }
      if (user.otpExpires.getTime() < Date.now()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "انتهت صلاحية رمز التحقق",
        });
      }

      const ok = await bcrypt.compare(otp, user.otpHash);
      if (!ok) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "رمز التحقق خاطئ",
        });
      }

      return { ok: true };
    }),

  // reset password (requires otp + email + newPassword)
  resetPassword: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        otp: z.string().min(4).max(8),
        newPassword: z.string().min(8),
      }),
    )
    .mutation(async ({ input, ctx: { db } }) => {
      const { email, otp, newPassword } = input;
      const user = await db.user.findUnique({ where: { email } });

      // eslint-disable-next-line
      if (!user || !user.otpHash || !user.otpExpires) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "عملية إعادة التعيين غير صالحة",
        });
      }
      if (user.otpExpires.getTime() < Date.now()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "انتهت صلاحية رمز التحقق",
        });
      }

      const ok = await bcrypt.compare(otp, user.otpHash);
      if (!ok) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "رمز التحقق خاطئ",
        });
      }

      const newHash = await bcrypt.hash(newPassword, 12);

      await db.user.update({
        where: { id: user.id },
        data: {
          passwordHash: newHash,
          otpHash: null,
          otpExpires: null,
        },
      });

      // optionally return a new token
      const token = await createJwt({ sub: user.id, username: user.username });
      return { ok: true, token };
    }),
});

// ---------------------- helper functions ----------------------
