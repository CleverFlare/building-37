import { z, type ZodType } from "zod/v4";
import type { dataTableConfig } from "./data-table";
import { endOfDay, startOfDay } from "date-fns";

type FilterVariants = (typeof dataTableConfig.filterVariants)[number];

type FilterOperators = (typeof dataTableConfig.operators)[number];

// eslint-disable-next-line
type Config = {
  [K in Exclude<FilterVariants, "range" | "dateRange">]: {
    transformer: ZodType;
    // eslint-disable-next-line
    operators: {
      [T in FilterOperators]?: (
        key: string,
        val: unknown[],
      ) => Record<string, unknown>;
    };
  };
};

export const prismaFiltersConfig: Config = {
  text: {
    transformer: z
      .string()
      .transform((val) => [val])
      .pipe(z.array(z.string())),
    operators: {
      iLike: (key, value) => ({
        [key]: { contains: value[0], mode: "insensitive" },
      }),
      notILike: (key, value) => ({
        [key]: { NOT: { contains: value[0], mode: "insensitive" } },
      }),
      eq: (key, value) => ({ [key]: { equals: value[0] } }),
      ne: (key, value) => ({ [key]: { NOT: { equals: value[0] } } }),
      isEmpty: (key) => ({ OR: [{ [key]: null }, { [key]: "" }] }),
      isNotEmpty: (key) => ({
        OR: [{ NOT: { [key]: null } }, { NOT: { [key]: "" } }],
      }),
    },
  },
  boolean: {
    transformer: z
      .string()
      .transform((val) => {
        if (val === "" || val === "false") return [false];
        if (val === "true") return [true];
        throw new Error("Invalid boolean string");
      })
      .pipe(z.array(z.boolean())),
    operators: {
      eq: (key, value) => ({ [key]: { equals: value[0] } }),
      ne: (key, value) => ({ [key]: { NOT: { equals: value[0] } } }),
    },
  },
  number: {
    transformer: z
      .union([
        z.string().transform((val) => [Number(val)]),
        z
          .array(z.string())
          .length(2)
          .transform((val) => val.map((item) => Number(item))),
      ])
      .pipe(z.array(z.number())),
    operators: {
      eq: (key, value) => ({ [key]: { equals: value[0] } }),
      ne: (key, value) => ({ [key]: { NOT: { equals: value[0] } } }),
      lt: (key, value) => ({ [key]: { lt: value[0] } }),
      gt: (key, value) => ({ [key]: { gt: value[0] } }),
      lte: (key, value) => ({ [key]: { lte: value[0] } }),
      gte: (key, value) => ({ [key]: { gte: value[0] } }),
      isBetween: (key, value) =>
        z
          .array(z.number())
          .transform((val) => ({
            [key]: {
              in: val,
            },
          }))
          .parse(value),
      isEmpty: (key) => ({ [key]: { equals: null } }),
      isNotEmpty: (key) => ({ [key]: { NOT: { equals: null } } }),
    },
  },
  select: {
    transformer: z
      .string()
      .transform((val) => [val])
      .pipe(z.array(z.string())),
    operators: {
      eq: (key, value) => ({ [key]: { equals: value[0] } }),
      ne: (key, value) => ({ [key]: { NOT: { equals: value[0] } } }),
      isEmpty: (key) => ({
        OR: [{ [key]: null }, { [key]: { equals: "" } }],
      }),
      isNotEmpty: (key) => ({
        OR: [{ NOT: { [key]: null } }, { NOT: { [key]: { equals: "" } } }],
      }),
    },
  },
  date: {
    transformer: z
      .union([
        z.string().transform((val) => [new Date(Number(val))]),
        z
          .array(z.string())
          .transform((val) => val.map((item) => new Date(Number(item))).sort()),
      ])
      .pipe(z.array(z.date())),
    operators: {
      eq: (key, value) => ({
        [key]: {
          gt: startOfDay(value[0] as Date),
          lt: endOfDay(value[0] as Date),
        },
      }),
      ne: (key, value) => ({
        [key]: {
          not: {
            gt: startOfDay(value[0] as Date),
            lt: endOfDay(value[0] as Date),
          },
        },
      }),
      lt: (key, value) => ({ [key]: { lt: startOfDay(value[0] as Date) } }),
      gt: (key, value) => ({ [key]: { gt: endOfDay(value[0] as Date) } }),
      lte: (key, value) => ({ [key]: { lte: endOfDay(value[0] as Date) } }),
      gte: (key, value) => ({ [key]: { gte: startOfDay(value[0] as Date) } }),
      isBetween: (key, value) =>
        z
          .array(z.date())
          .transform((val) => ({
            [key]: {
              lte: startOfDay(val[1]!),
              gte: endOfDay(val[0]!),
            },
          }))
          .parse(value),
      isEmpty: (key) => ({ [key]: { equals: null } }),
      isNotEmpty: (key) => ({ [key]: { NOT: { equals: null } } }),
    },
  },
  multiSelect: {
    transformer: z.array(z.string()),
    operators: {
      inArray: (key, value) => ({ [key]: { hasSome: value } }),
      notInArray: (key, value) => ({ [key]: { hasSome: value } }),
      isEmpty: (key) => ({ [key]: { isEmpty: true } }),
      isNotEmpty: (key) => ({ [key]: { isEmpty: false } }),
    },
  },
};
