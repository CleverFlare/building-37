import { db } from "@/server/db";
import { EditApartmentForm } from "./form";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await db.apartment.findUnique({ where: { id } });

  if (!data) redirect("/not-found");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">إضافة شقة</h2>
        <p className="text-muted-foreground">
          تتيح هذه الصفحة إضافة شقة جديدة إلى قاعدة البيانات. تحتوي الصفحة على
          نموذج مُخصص يشمل الحقول الأساسية مثل رقم الشقة إسم المالك وإسم
          المستأجر.
        </p>
      </div>
      <EditApartmentForm
        id={id}
        initialValues={{
          apartmentNumber: data.apartmentNumber,
          owner: { name: data.ownerName, phone: data.ownerPhone },
          state: data.state,
          renter: {
            name: data.renterName ?? "",
            phone: data.renterPhone ?? "",
          },
        }}
      />
    </div>
  );
}
