import { db } from "@/server/db";
import type { GetExpensesSchema } from "./validations";
import {
  filtersToPrismaWhere,
  type Filter,
} from "@/features/data-table/lib/filters-prisma-where";
import type { Prisma } from "@prisma/client";

export async function getExpenses(input: GetExpensesSchema) {
  const whereClause = filtersToPrismaWhere<Prisma.ExpenseWhereInput>(
    input.filters as unknown as Filter[],
    input.joinOperator,
  );

  const offset = (input.page - 1) * input.perPage;
  const limit = input.perPage;

  const monthYearFilter = { month: input.month, year: input.year };

  const whereObject: Prisma.ExpenseWhereInput = {
    AND: [monthYearFilter, whereClause],
  };

  const [data, total, aggregate] = await Promise.all([
    db.expense.findMany({
      where: whereObject,
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
    }),
    db.expense.count({ where: whereObject }),
    db.expense.aggregate({
      where: monthYearFilter,
      _sum: { amount: true },
    }),
  ]);

  return {
    data,
    pageCount: Math.ceil(total / limit),
    totalAmount: aggregate._sum.amount ?? 0,
  };
}
