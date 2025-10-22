import { PrismaClient } from "@prisma/client";

import { env } from "@/env";

const createPrismaClient = () => {
  const prisma = new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  }).$extends({
    query: {
      user: {
        async create({ args, query }) {
          args.data = {
            ...args.data,
            fullName: `${args.data.firstName} ${args.data.lastName}`,
          };

          return query(args);
        },

        async update({ args, query }) {
          const record = await prisma.user.findUnique({ where: args.where });

          args.data = {
            ...args.data,
            fullName: `${(args.data?.firstName as string) ?? record?.firstName?.toString()} ${(args.data?.lastName as string) ?? record?.lastName}`,
          };

          return query(args);
        },
      },
    },
  });

  return prisma;
};

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
