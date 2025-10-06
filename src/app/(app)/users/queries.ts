import { db } from "@/server/db";
import type { GetUsersSchema } from "./validations";
import {
  filtersToPrismaWhere,
  type Filter,
} from "@/features/data-table/lib/filters-prisma-where";
import type { Prisma } from "@prisma/client";

export async function getUsers(input: GetUsersSchema) {
  const whereClause = filtersToPrismaWhere<Prisma.ApartmentWhereInput>(
    input.filters as unknown as Filter[],
    input.joinOperator,
  );

  const offset = (input.page - 1) * input.perPage;

  const limit = input.perPage;

  let whereObject = {};

  if (input.name)
    whereObject = { AND: [{ ownerName: input.name }, { ...whereClause }] };
  else whereObject = whereClause;

  const data = await db.user.findMany({
    where: whereObject,
    take: limit,
    skip: offset,
    orderBy: { createdAt: "asc" },
  });

  const total = await db.user.count({
    where: whereObject,
  });

  const totalPages = Math.ceil(total / input.perPage);

  return { data, pageCount: totalPages };
}
