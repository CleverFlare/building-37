import { db } from "@/server/db";
import type { GetApartmentsSchema } from "./validations";
import { filtersToPrismaWhere } from "@/lib/filters-prisma-where";
import type { Prisma } from "@prisma/client";

export async function getApartments(input: GetApartmentsSchema) {
  const whereClause = filtersToPrismaWhere<Prisma.ApartmentWhereInput>(
    input.filters,
    input.joinOperator,
  );

  const offset = (input.page - 1) * input.perPage;

  const limit = input.perPage;

  const data = await db.apartment.findMany({
    where: whereClause,
    take: limit,
    skip: offset,
  });

  const total = await db.apartment.count({
    where: whereClause,
  });

  const totalPages = Math.ceil(total / input.perPage);

  return { data, pageCount: totalPages };
}
