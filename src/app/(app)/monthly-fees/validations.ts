import {
  getFiltersStateParser,
  getSortingStateParser,
} from "@/features/data-table/lib/parsers";

import type { MonthlyFee } from "@prisma/client";

import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";

export const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<MonthlyFee>().withDefault([
    { id: "createdAt", desc: true },
  ]),
  // advanced filter
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
  name: parseAsString.withDefault(""),
  month: parseAsInteger.withDefault(new Date().getMonth()),
  year: parseAsInteger.withDefault(new Date().getFullYear()),
});

export type GetMonthlyFeesSchema = Awaited<
  ReturnType<typeof searchParamsCache.parse>
>;
