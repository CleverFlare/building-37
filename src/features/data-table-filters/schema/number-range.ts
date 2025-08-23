import { z } from "zod/v4";

export const numberRangeSchema = z.object({
  from: z.number(),
  to: z.number(),
});

export type NumberRangeSchema = z.infer<typeof numberRangeSchema>;
