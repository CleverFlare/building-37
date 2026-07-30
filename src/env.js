import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4";

// R2_ENDPOINT=https://530f69d363f44bcc323fb78184942536.r2.cloudflarestorage.com/building-finances
// API_TOKEN=5kcp_P_3Vl24XbQOvj2_2QPyDiHeUV34FZtiYgLJ
// AWS_ACCESS_KEY_ID=50b28075dd5f9520c1d1e851bbd08fed
// AWS_SECRET_ACCESS_KEY=524554eb9bbb432cd1734ae2feb77f2c0f17341ceda68571b16758f45d8ca032
// R2_BUCKET_NAME=building-finances
// R2_BUCKET=building-finances

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    DEFAULT_MONTHLY_FEE: z
      .string()
      .transform((v) => +v)
      .pipe(z.int()),
    JWT_PRIVATE: z.string(),
    GMAIL_USER: z.string(),
    GMAIL_PASS: z.string(),
    PASSWORD_SALT: z
      .string()
      .transform((v) => +v)
      .pipe(z.number()),

    OBJECT_STORAGE_ACCESS_KEY: z.string(),
    OBJECT_STORAGE_SECRET_KEY: z.string(),
    OBJECT_STORAGE_BUCKET_NAME: z.string(),
    OBJECT_STORAGE_ENDPOINT: z.string(),

    MONGO_ROOT_USER: z.string(),
    MONGO_ROOT_PASSWORD: z.string(),
    MONGO_DB_NAME: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    JWT_PRIVATE: process.env.JWT_PRIVATE,
    GMAIL_USER: process.env.GMAIL_USER,
    GMAIL_PASS: process.env.GMAIL_PASS,
    PASSWORD_SALT: process.env.PASSWORD_SALT,
    DEFAULT_MONTHLY_FEE: process.env.DEFAULT_MONTHLY_FEE,

    OBJECT_STORAGE_ACCESS_KEY: process.env.OBJECT_STORAGE_ACCESS_KEY,
    OBJECT_STORAGE_SECRET_KEY: process.env.OBJECT_STORAGE_SECRET_KEY,
    OBJECT_STORAGE_BUCKET_NAME: process.env.OBJECT_STORAGE_BUCKET_NAME,
    OBJECT_STORAGE_ENDPOINT: process.env.OBJECT_STORAGE_ENDPOINT,

    MONGO_ROOT_USER: process.env.MONGO_ROOT_USER,
    MONGO_ROOT_PASSWORD: process.env.MONGO_ROOT_PASSWORD,
    MONGO_DB_NAME: process.env.MONGO_DB_NAME,

    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
