import { columns } from "./columns";
import { ApartmentsTable } from "./data-table";
import type { SearchParams } from "nuqs/server";
import { getValidFilters } from "@/lib/data-table";
import { searchParamsCache } from "./validations";
import { getApartments } from "./queries";

export default async function Page({
  searchParams: sp,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await sp;

  const params = searchParamsCache.parse(searchParams);

  const validFilters = getValidFilters(params.filters);

  const { data, pageCount } = await getApartments({
    ...params,
    filters: validFilters,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">الشقق</h2>
        <p className="text-muted-foreground">
          تتيح هذه الصفحة للمستخدم عرض وإدارة بيانات الشقق في العمارة. يمكن
          للمستخدم تصفح قائمة الشقق من خلال جدول بيانات يحتوي على معلومات
          تفصيلية مثل رقم الشقة، المالك، المقيم الحالي (سواء كان المالك أو
          المستأجر).
        </p>
      </div>
      <ApartmentsTable columns={columns} data={data} pageCount={pageCount} />
    </div>
  );
}
