import { db } from "@/server/db";
import type { GetMonthlyFeesSchema } from "./validations";
import {
  filtersToPrismaWhere,
  type Filter,
} from "@/features/data-table/lib/filters-prisma-where";
import type { Prisma } from "@prisma/client";

export async function getMonthlyFees(input: GetMonthlyFeesSchema) {
  const whereClause = filtersToPrismaWhere<Prisma.MonthlyFeeWhereInput>(
    input.filters as unknown as Filter[],
    input.joinOperator,
  );

  const offset = (input.page - 1) * input.perPage;

  const limit = input.perPage;

  let whereObject = {};

  if (input.name)
    whereObject = { AND: [{ ownerName: input.name }, { ...whereClause }] };
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

  const totalPages = Math.ceil(total / input.perPage);

  return { data, pageCount: totalPages };
}
