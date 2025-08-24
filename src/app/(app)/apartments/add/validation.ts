import { z } from "zod/v4";

const ownerSchema = z.object({
  name: z.string("هذا الحقل مطلوب").min(1, "هذا الحقل مطلوب"),
  phone: z.string("هذا الحقل مطلوب").min(1, "هذا الحقل مطلوب"), // يمكن إضافة regex للتحقق من صحة رقم الهاتف
});

const occupantSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
});

export const addApartmentSchema = z
  .object({
    apartmentNumber: z.number().min(1),
    owner: ownerSchema,
    occupant: occupantSchema,
    occupied: z.boolean({ error: "هذا الحقل مطلوب" }),
    rented: z.boolean({ error: "هذا الحقل مطلوب" }),
  })
  .check(({ value, issues }) => {
    if (value.rented && !value.occupied) {
      issues.push({
        code: "custom",
        path: ["rented"],
        message: "لا يمكن تأجير شقة غير مسكونة.",
        input: value.rented,
      });
    }
    //eslint-disable-next-line
    if (value.rented && (!value?.occupant || !value?.occupant?.name)) {
      issues.push({
        code: "custom",
        path: ["occupant", "name"],
        message: "الشقة المؤجرة يجب أن تحتوي على بيانات المستأجر (الساكن).",
        input: value.occupied,
      });
    }
    if (value.occupied && !value.occupant.name) {
      issues.push({
        code: "custom",
        path: ["occupant", "name"],
        message: "هذا الحقل مطلوب",
        input: value.occupied,
      });
    }
  });

export type AddApartmentSchema = z.infer<typeof addApartmentSchema>;
