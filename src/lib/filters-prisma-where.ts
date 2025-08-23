import type { dataTableConfig } from "@/config/data-table";

type Filter = {
  id: string;
  variant: (typeof dataTableConfig.filterVariants)[number];
  operator: (typeof dataTableConfig.operators)[number];
  value: unknown;
};

export function filtersToPrismaWhere<T>(
  filters: Filter[],
  joinOperator: "and" | "or" = "and",
): T {
  // Replace `UserWhereInput` with your actual Prisma model input type
  const conditions: Record<string, unknown>[] = [];

  for (const { id, operator, value } of filters) {
    let clause: Record<string, unknown> = {};

    switch (operator) {
      /** ─────────────── TEXT ─────────────── */
      case "iLike":
        clause = { [id]: { contains: value, mode: "insensitive" } };
        break;
      case "notILike":
        clause = { [id]: { NOT: { contains: value, mode: "insensitive" } } };
        break;

      /** ─────────────── EQUALITY ─────────────── */
      case "eq":
        clause = { [id]: { equals: value } };
        break;
      case "ne":
        clause = { [id]: { not: value } };
        break;

      /** ─────────────── NUMERIC / DATE COMPARISONS ─────────────── */
      case "lt":
        clause = { [id]: { lt: value } };
        break;
      case "lte":
        clause = { [id]: { lte: value } };
        break;
      case "gt":
        clause = { [id]: { gt: value } };
        break;
      case "gte":
        clause = { [id]: { gte: value } };
        break;

      /** ─────────────── RANGE ─────────────── */
      case "isBetween":
        if (!Array.isArray(value) || value.length !== 2) {
          throw new Error(`"isBetween" requires an array of two values`);
        }
        clause = {
          AND: [
            { [id]: { gte: (value as number[])[0] } },
            { [id]: { lte: (value as number[])[1] } },
          ],
        };
        break;

      /** ─────────────── MULTI SELECT ─────────────── */
      case "inArray":
        clause = {
          [id]: { hasSome: Array.isArray(value) ? value : [value] },
        };
        break;
      case "notInArray":
        clause = {
          NOT: { [id]: { hasSome: Array.isArray(value) ? value : [value] } },
        };
        break;

      /** ─────────────── EMPTY / NOT EMPTY ─────────────── */
      case "isEmpty":
        clause = { [id]: null };
        break;
      case "isNotEmpty":
        clause = { NOT: { [id]: null } };
        break;

      default:
        throw new Error(`Unsupported operator: ${operator as string}`);
    }

    conditions.push(clause);
  }

  if (conditions.length === 0) return {} as T;

  return { [joinOperator.toUpperCase()]: conditions } as T;
}
