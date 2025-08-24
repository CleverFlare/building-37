import { z } from "zod/v4";

export const createApartmentSchema = z
  .object({
    apartmentNumber: z.number("هذا الحقل مطلوب"),
    owner: z.object(
      {
        name: z.string("هذا الحقل مطلوب"),
        phone: z.string("هذا الحقل مطلوب"),
      },
      "هذا الحقل مطلوب",
    ),
    occupant: z.object({
      name: z.string().optional(),
      phone: z.string().optional(),
    }),
    rented: z.boolean("هذا الحقل مطلوب"),
    occupied: z.boolean("هذا الحقل مطلوب"),
  })
  .check(({ value, issues }) => {
    if (value.occupied && !value.occupant) {
      issues.push({
        code: "custom",
        path: ["message"],
        message: "لم يتم تحصيل بيانات الساكن رغم ان الشقة مسكونة",
        input: value.occupant,
      });
    }
  });
