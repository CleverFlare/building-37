import {
  getFiltersStateParser,
  getSortingStateParser,
} from "@/features/data-table/lib/parsers";

import type { Expense } from "@prisma/client";

import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsStringEnum,
} from "nuqs/server";

export const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<Expense>().withDefault([
    { id: "createdAt", desc: true },
  ]),
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
  month: parseAsInteger.withDefault(new Date().getMonth()),
  year: parseAsInteger.withDefault(new Date().getFullYear()),
});

export type GetExpensesSchema = Awaited<
  ReturnType<typeof searchParamsCache.parse>
>;
