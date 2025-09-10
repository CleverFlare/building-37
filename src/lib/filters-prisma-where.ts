import type { dataTableConfig } from "@/config/data-table";
import { prismaFiltersConfig } from "@/config/prisma-filters";

export type Filter = {
  id: string;
  variant: Exclude<
    (typeof dataTableConfig.filterVariants)[number],
    "range" | "dateRange"
  >;
  operator: (typeof dataTableConfig.operators)[number];
  value: unknown;
};

export function filtersToPrismaWhere<T>(
  filters: Filter[],
  joinOperator: "and" | "or" = "and",
): T {
  // Replace `UserWhereInput` with your actual Prisma model input type
  const conditions: Record<string, unknown>[] = [];

  for (const { id, operator, variant, value } of filters) {
    const variantConfig = prismaFiltersConfig[variant];

    const typedValue = variantConfig.transformer.parse(value);

    const clause = variantConfig.operators[operator]!(
      id,
      typedValue as unknown[],
    );

    conditions.push(clause);
  }

  if (conditions.length === 0) return {} as T;

  return { [joinOperator.toUpperCase()]: conditions } as T;
}
