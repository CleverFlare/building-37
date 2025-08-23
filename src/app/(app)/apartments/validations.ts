import { getFiltersStateParser, getSortingStateParser } from "@/lib/parsers";
import type { Apartment } from "@prisma/client";
import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsStringEnum,
} from "nuqs/server";

export const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<Apartment>().withDefault([
    { id: "createdAt", desc: true },
  ]),
  // advanced filter
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});

export type GetApartmentsSchema = Awaited<
  ReturnType<typeof searchParamsCache.parse>
>;
