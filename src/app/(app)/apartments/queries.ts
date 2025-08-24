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

  let whereObject = {};

  if (input.name)
    whereObject = { AND: [{ ownerName: input.name }, { ...whereClause }] };
  else whereObject = whereClause;

  const data = await db.apartment.findMany({
    where: whereObject,
    take: limit,
    skip: offset,
    orderBy: { apartmentNumber: "asc" },
  });

  const total = await db.apartment.count({
    where: whereObject,
  });

  const totalPages = Math.ceil(total / input.perPage);

  return { data, pageCount: totalPages };
}
