import {
  getFiltersStateParser,
  getSortingStateParser,
} from "@/features/data-table/lib/parsers";

import { z } from "zod/v4";

import type { Apartment } from "@prisma/client";

import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
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
  name: parseAsString.withDefault(""),
});

export type GetUsersSchema = Awaited<
  ReturnType<typeof searchParamsCache.parse>
>;

export const userSchema = z.object({
  firstName: z.string().min(1, "الإسم الأول مطلوب"),
  lastName: z.string().min(1, "الإسم الأخير مطلوب"),
  username: z.string().min(3, "إسم المستخدم يجب أن يكون 3 أحرف على الأقل"),
  password: z
    .string()
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
    .optional(),
  email: z.email("البريد الإلكتروني غير صالح"),
  role: z.enum(["user", "moderator"]),
});

export type UserSchema = z.infer<typeof userSchema>;
