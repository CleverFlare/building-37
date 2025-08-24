import { AddApartmentForm } from "./form";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">إضافة شقة</h2>
        <p className="text-muted-foreground">
          تتيح هذه الصفحة إضافة شقة جديدة إلى قاعدة البيانات. تحتوي الصفحة على
          نموذج مُخصص يشمل الحقول الأساسية مثل رقم الشقة إسم المالك وإسم الساكن.
        </p>
      </div>
      <AddApartmentForm />
    </div>
  );
}
