import { db } from "@/server/db";
import type { GetMonthlyFeesSchema } from "./validations";
import {
  filtersToPrismaWhere,
  type Filter,
} from "@/features/data-table/lib/filters-prisma-where";
import type { Prisma } from "@prisma/client";
import { endOfDay, startOfDay } from "date-fns";
import { getGlobalValue } from "@/lib/global-values";

export async function getMonthlyFees(input: GetMonthlyFeesSchema) {
  const whereClause = filtersToPrismaWhere<Prisma.MonthlyFeeWhereInput>(
    input.filters as unknown as Filter[],
    input.joinOperator,
  );

  const offset = (input.page - 1) * input.perPage;

  const limit = input.perPage;

  let whereObject = {};

  const thisMonthStart = new Date(input.year, input.month, 1);

  const thisMonthEnd = new Date(input.year, input.month + 1, 0);

  if (input.name)
    whereObject = {
      AND: [
        {
          createdAt: {
            gt: startOfDay(thisMonthStart),
            lt: endOfDay(thisMonthEnd),
          },
        },
        { ...whereClause },
      ],
    };
  else whereObject = whereClause;

  const data = await db.monthlyFee.findMany({
    where: whereObject,
    take: limit,
    skip: offset,
    orderBy: { apartmentNumber: "asc" },
  });

  const total = await db.monthlyFee.count({
    where: whereObject,
  });

  const monthlyFee = await getGlobalValue("monthlyFee");

  const totalPages = Math.ceil(total / input.perPage);

  return { data, pageCount: totalPages, monthlyFee };
}
