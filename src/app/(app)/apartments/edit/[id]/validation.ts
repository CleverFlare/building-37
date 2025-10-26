import { z } from "zod/v4";

const ownerSchema = z.object({
  name: z.string("هذا الحقل مطلوب").min(1, "هذا الحقل مطلوب"),
  phone: z.string("هذا الحقل مطلوب").min(1, "هذا الحقل مطلوب"), // يمكن إضافة regex للتحقق من صحة رقم الهاتف
});

const renterSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
});

export const editApartmentSchema = z
  .object({
    apartmentNumber: z.number().min(1),
    owner: ownerSchema,
    renter: renterSchema,
    state: z.enum(["vacant", "occupied", "rented"]),
  })
  .check(({ value, issues }) => {
    const { state, renter } = value;

    // If rented, renter name is required
    if (state === "rented" && !renter?.name) {
      issues.push({
        code: "custom",
        path: ["renter", "name"],
        message: "الشقة المؤجرة يجب أن تحتوي على بيانات المستأجر.",
        input: renter?.name,
      });
    }

    // If occupied by owner, renter should not be required — no issue needed
    // If vacant, renter should not be required — no issue needed
  });

export type EditApartmentSchema = z.infer<typeof editApartmentSchema>;
