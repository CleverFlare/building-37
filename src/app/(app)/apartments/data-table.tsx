"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { DataTableFilterList } from "@/components/data-table/data-table-filter-list";
import NuqsSearchInput from "@/components/nuqs-search-input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
}

export function ApartmentsTable<TData, TValue>({
  columns,
  data,
  pageCount,
}: DataTableProps<TData, TValue>) {
  const { table } = useDataTable({
    pageCount,
    data,
    columns,
    clearOnDefault: true,
    enableAdvancedFilter: true,
    shallow: false,
    initialState: {
      columnVisibility: {
        searchableOccupantName: false,
      },
    },
  });

  return (
    <DataTable table={table}>
      <div className="flex items-center justify-between">
        <NuqsSearchInput placeholder="بحث في أسماء الملاك..." />
        <div className="flex items-center gap-4">
          <DataTableFilterList table={table} />
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
