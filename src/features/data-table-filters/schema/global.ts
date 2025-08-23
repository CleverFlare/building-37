import { z } from "zod/v4";
import { filtersMap } from "../constants/filters-map";

export const filterSchema = z.object({
  label: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.enum(Object.keys(filtersMap)),
});

export const storedFilterSchema = z.object({
  label: z.string(),
  type: z.enum(Object.keys(filtersMap)),
  value: z.any(),
});

export type StoredFilterSchema = z.infer<typeof storedFilterSchema>;

export type FilterSchema = z.infer<typeof filterSchema>;

export type FiltersMap = typeof filtersMap;

export type SchemaTypes = {
  [K in keyof FiltersMap]: z.infer<FiltersMap[K]["schema"]>;
}[keyof FiltersMap];
