import { getUsers } from "./queries";
import { searchParamsCache } from "./validations";
import { UsersTable } from "./data-table";
import { columns } from "./columns";

export default async function UsersPage({
  searchParams: sp,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const searchParams = await sp;

  const params = searchParamsCache.parse(searchParams);

  const { data, pageCount } = await getUsers(params);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">المستخدمين</h2>
        <p className="text-muted-foreground">قيد الإنشاء</p>
      </div>
      <UsersTable data={data} columns={columns} pageCount={pageCount} />
    </div>
  );
}
