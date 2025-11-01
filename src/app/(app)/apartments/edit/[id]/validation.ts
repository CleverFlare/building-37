import { Status } from "@prisma/client";
import { z } from "zod/v4";

const ownerSchema = z.object({
  id: z.string().optional(),
  name: z.string("هذا الحقل مطلوب").min(1, "هذا الحقل مطلوب"),
  phone: z.string("هذا الحقل مطلوب").min(1, "هذا الحقل مطلوب"), // يمكن إضافة regex للتحقق من صحة رقم الهاتف
  ownershipStartAt: z.date("هذا الحقل مطلوب"),
  ownershipEndAt: z.date().nullable(),
  idPhoto: z.union([z.file().nullable(), z.string().nullable()]),
  idPhotoKey: z.string().nullable(),
});

const renterSchema = z.object({
  id: z.string().optional(),
  name: z.string("هذا الحقل مطلوب").min(1, "هذا الحقل مطلوب"),
  phone: z.string().nullable(),
  rentStartAt: z.date("هذا الحقل مطلوب"),
  rentEndAt: z.date().nullable(),
  idPhoto: z.union([z.file().nullable(), z.string().nullable()]),
  idPhotoKey: z.string().nullable(),
});

export const editApartmentSchema = z.object({
  apartmentNumber: z.number("هذا الحقل مطلوب").min(1),
  owner: z.array(ownerSchema, "هذا الحقل مطلوب"),
  renter: z.array(renterSchema, "هذا الحقل مطلوب"),
  status: z.enum(
    [Status?.vacant ?? "vacant", Status?.occupied ?? "occupied"],
    "هذا الحقل مطلوب",
  ),
});

export type EditApartmentSchema = z.infer<typeof editApartmentSchema>;
