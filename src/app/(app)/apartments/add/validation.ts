import { Status } from "@prisma/client";
import { z } from "zod/v4";

const ownerSchema = z.object({
  name: z.string("هذا الحقل مطلوب").min(1, "هذا الحقل مطلوب"),
  phone: z.string("هذا الحقل مطلوب").min(1, "هذا الحقل مطلوب"), // يمكن إضافة regex للتحقق من صحة رقم الهاتف
  ownershipStartAt: z.date("هذا الحقل مطلوب"),
  ownershipEndAt: z.date().nullable(),
  idPhoto: z.file().nullable(),
});

const renterSchema = z.object({
  name: z.string("هذا الحقل مطلوب").min(1, "هذا الحقل مطلوب"),
  phone: z.string().nullable(),
  rentStartAt: z.date("هذا الحقل مطلوب"),
  rentEndAt: z.date().nullable(),
  idPhoto: z.file().nullable(),
});

export const addApartmentSchema = z.object({
  apartmentNumber: z.number("هذا الحقل مطلوب").min(1),
  owner: z.array(ownerSchema, "هذا الحقل مطلوب"),
  renter: z.array(renterSchema, "هذا الحقل مطلوب"),
  status: z.enum(
    [Status?.vacant ?? "vacant", Status?.occupied ?? "occupied"],
    "هذا الحقل مطلوب",
  ),
});

export type AddApartmentSchema = z.infer<typeof addApartmentSchema>;
