import type { SearchParams } from "nuqs/server";
import { columns } from "./columns";
import { MonthlyFeesTable } from "./data-table";
import { searchParamsCache } from "./validations";
import { getValidFilters } from "@/features/data-table/lib/data-table";
import { getMonthlyFees } from "./queries";

export default async function Page({
  searchParams: sp,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await sp;

  const params = searchParamsCache.parse(searchParams);

  const validFilters = getValidFilters(params.filters);

  const { data, pageCount } = await getMonthlyFees({
    ...params,
    filters: validFilters,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">المصروفات الشهرية</h2>
        <p className="text-muted-foreground">
          تمكّن الصفحة من جمع الرسوم الشهرية من الشقق عبر رموز QR تتيح للمقيمين
          الدفع بسهولة وسرعة.
        </p>
      </div>
      <MonthlyFeesTable columns={columns} data={data} pageCount={pageCount} />
    </div>
  );
}
