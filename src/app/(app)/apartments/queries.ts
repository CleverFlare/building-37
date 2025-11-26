import { db } from "@/server/db";
import type { GetApartmentsSchema } from "./validations";
import {
  filtersToPrismaWhere,
  type Filter,
} from "@/features/data-table/lib/filters-prisma-where";
import type { Prisma } from "@prisma/client";

export async function getApartments(input: GetApartmentsSchema) {
  const whereClause = filtersToPrismaWhere<Prisma.ApartmentWhereInput>(
    input.filters as unknown as Filter[],
    input.joinOperator,
    ["ownerName", "renterName", "ownerPhone", "renterPhone"],
  );

  const offset = (input.page - 1) * input.perPage;

  const limit = input.perPage;

  let whereObject = {};

  const renterName = input.filters.find((filter) => filter.id === "renterName");
  const renterPhone = input.filters.find(
    (filter) => filter.id === "renterPhone",
  );
  const ownerPhone = input.filters.find((filter) => filter.id === "ownerPhone");

  if (renterName || renterPhone) {
    whereClause.renters = {};
    whereClause.renters.some = {};
    whereClause.renters.some.OR = [];

    if (renterName)
      whereClause.renters.some.OR.push({
        name: { contains: renterName.value as string },
      });

    if (renterPhone)
      whereClause.renters.some.OR.push({
        phone: { contains: renterPhone.value as string },
      });
  }

  if (input.name || ownerPhone) {
    whereClause.owners = {};
    whereClause.owners.some = {};
    whereClause.owners.some.OR = [];

    if (input.name)
      whereClause.owners.some.OR.push({
        name: { contains: input.name },
      });

    if (ownerPhone)
      whereClause.owners.some.OR.push({
        phone: { contains: ownerPhone.value as string },
      });
  }

  whereObject = {
    AND: [whereClause],
  };

  const data = await db.apartment.findMany({
    where: whereObject,
    take: limit,
    skip: offset,
    orderBy: { apartmentNumber: "asc" },
    include: {
      owners: { orderBy: { ownershipEndAt: "desc" }, take: 1 },
      renters: { orderBy: { rentStartAt: "desc" }, take: 1 },
    },
  });

  const total = await db.apartment.count({
    where: whereObject,
  });

  const totalPages = Math.ceil(total / input.perPage);

  return {
    data: data.map((apartment) => ({
      ...apartment,
      renters: apartment.renters,
      owners: apartment.owners!,
    })),
    pageCount: totalPages,
  };
}
