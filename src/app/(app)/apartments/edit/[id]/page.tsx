import { db } from "@/server/db";
import { EditApartmentForm } from "./form";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await db.apartment.findUnique({
    where: { id },
    include: { owners: true, renters: true },
  });

  if (!data) redirect("/not-found");

  console.log(data.owners[0]?.idPhoto);

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
          status: data.status,
          owner: data.owners,
          renter: data.renters,
        }}
      />
    </div>
  );
}
