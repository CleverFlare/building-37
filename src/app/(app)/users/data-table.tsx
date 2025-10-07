"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { DataTableFilterList } from "@/features/data-table/components/data-table-filter-list";
import NuqsSearchInput from "@/components/nuqs-search-input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/features/data-table/components/data-table";
import { useDataTable } from "@/features/data-table/hooks/use-data-table";
import { TableActionBar } from "./action-bar";
import type { User } from "./columns";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
}

export function UsersTable<TValue>({
  columns,
  data,
  pageCount,
}: DataTableProps<User, TValue>) {
  const { table, shallow, debounceMs, throttleMs } = useDataTable({
    pageCount,
    data,
    columns,
    clearOnDefault: true,
    enableAdvancedFilter: true,
    shallow: false,
    initialState: {
      columnVisibility: {
        firstName: false,
        lastName: false,
      },
    },
  });

  return (
    <DataTable table={table} actionBar={<TableActionBar table={table} />}>
      <div className="flex items-center justify-between">
        <NuqsSearchInput placeholder="بحث في إسم المستخدم..." />
        <div className="flex items-center gap-4">
          <DataTableFilterList
            table={table}
            shallow={shallow}
            debounceMs={debounceMs}
            throttleMs={throttleMs}
          />
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-5"
          />
          <Button asChild>
            <Link href="/apartments/add">
              <PlusIcon />
              إضافة
            </Link>
          </Button>
        </div>
      </div>
    </DataTable>
  );
}
