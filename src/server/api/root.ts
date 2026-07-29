import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { z } from "zod/v4";
import { ar } from "zod/v4/locales";
import { apartmentsRouter } from "./routers/apartments/router";
import { authRouter } from "./routers/auth/router";
import { usersRouter } from "./routers/users/router";
import { monthlyFeesRouter } from "./routers/monthly-fees/router";
import { systemRouter } from "./routers/system/router";
import { expensesRouter } from "./routers/expenses/router";

z.config(ar());

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  apartments: apartmentsRouter,
  auth: authRouter,
  users: usersRouter,
  monthlyFees: monthlyFeesRouter,
  system: systemRouter,
  expenses: expensesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
