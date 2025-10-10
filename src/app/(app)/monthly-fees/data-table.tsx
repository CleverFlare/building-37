"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { DataTableFilterList } from "@/features/data-table/components/data-table-filter-list";
import NuqsSearchInput from "@/components/nuqs-search-input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { QrCodeIcon } from "@phosphor-icons/react/dist/ssr";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/features/data-table/components/data-table";
import { useDataTable } from "@/features/data-table/hooks/use-data-table";
import { TableActionBar } from "./action-bar";
import type { MonthlyFee } from "./columns";
import MonthYearPicker from "@/components/nuqs-month-picker";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
}

export function MonthlyFeesTable<TValue>({
  columns,
  data,
  pageCount,
}: DataTableProps<MonthlyFee, TValue>) {
  const { table, shallow, debounceMs, throttleMs } = useDataTable({
    pageCount,
    data,
    columns,
    clearOnDefault: true,
    enableAdvancedFilter: true,
    shallow: false,
    initialState: {
      columnVisibility: {
        isOccupied: false,
      },
    },
  });

  return (
    <DataTable table={table} actionBar={<TableActionBar table={table} />}>
      <div className="flex items-center justify-between">
        <MonthYearPicker />
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
          <Button>
            <QrCodeIcon />
            مسح رمز QR
          </Button>
        </div>
      </div>
    </DataTable>
  );
}
