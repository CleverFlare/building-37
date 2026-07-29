import type { SearchParams } from "nuqs/server";
import { columns } from "./columns";
import { ExpensesTable } from "./data-table";
import { searchParamsCache } from "./validations";
import { getValidFilters } from "@/features/data-table/lib/data-table";
import { getExpenses } from "./queries";

export default async function Page({
  searchParams: sp,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await sp;
  const params = searchParamsCache.parse(searchParams);
  const validFilters = getValidFilters(params.filters);

  const { data, pageCount, totalAmount } = await getExpenses({
    ...params,
    filters: validFilters,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">المصروفات</h2>
        <p className="text-muted-foreground">
          تتبّع مصروفات العمارة الشهرية وما يُخصم من إجمالي التحصيلات.
        </p>
      </div>
      <ExpensesTable
        columns={columns}
        data={data}
        pageCount={pageCount}
        totalAmount={totalAmount}
      />
    </div>
  );
}
