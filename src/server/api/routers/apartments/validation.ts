import { z } from "zod/v4";

const ownerSchema = z.object({
  name: z.string("هذا الحقل مطلوب").min(1, "هذا الحقل مطلوب"),
  phone: z.string("هذا الحقل مطلوب").min(1, "هذا الحقل مطلوب"), // يمكن إضافة regex للتحقق من صحة رقم الهاتف
});

const occupantSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
});

export const createApartmentSchema = z
  .object({
    apartmentNumber: z.number().min(1),
    owner: ownerSchema,
    occupant: occupantSchema,
    state: z.enum(["vacant", "occupied", "rented"]),
  })
  .check(({ value, issues }) => {
    const { state, occupant } = value;

    // If rented, occupant name is required
    if (state === "rented" && !occupant?.name) {
      issues.push({
        code: "custom",
        path: ["occupant", "name"],
        message: "الشقة المؤجرة يجب أن تحتوي على بيانات المستأجر (الساكن).",
        input: occupant?.name,
      });
    }

    // If occupied by owner, occupant should not be required — no issue needed
    // If vacant, occupant should not be required — no issue needed
  });

export const editApartmentSchema = z
  .object({
    id: z.string(),
    apartmentNumber: z.number().min(1),
    owner: ownerSchema,
    occupant: occupantSchema,
    state: z.enum(["vacant", "occupied", "rented"]),
  })
  .check(({ value, issues }) => {
    const { state, occupant } = value;

    // If rented, occupant name is required
    if (state === "rented" && !occupant?.name) {
      issues.push({
        code: "custom",
        path: ["occupant", "name"],
        message: "الشقة المؤجرة يجب أن تحتوي على بيانات المستأجر (الساكن).",
        input: occupant?.name,
      });
    }

    // If occupied by owner, occupant should not be required — no issue needed
    // If vacant, occupant should not be required — no issue needed
  });

export const deleteApartmentSchema = z.array(z.object({ id: z.string() }));
