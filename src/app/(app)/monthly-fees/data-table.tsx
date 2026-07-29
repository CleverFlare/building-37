"use client";

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { DataTableFilterList } from "@/features/data-table/components/data-table-filter-list";
import { Button } from "@/components/ui/button";
import { PencilSimpleIcon, QrCodeIcon } from "@phosphor-icons/react/dist/ssr";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/features/data-table/components/data-table";
import { useDataTable } from "@/features/data-table/hooks/use-data-table";
import { TableActionBar } from "./action-bar";
import type { MonthlyFee } from "./columns";
import MonthYearPicker from "@/components/nuqs-month-picker";
import QrScanDialog from "@/components/qr-scan-dialog";
import ManualFeeDialog from "@/components/manual-fee-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
}

export function MonthlyFeesTable<TValue>({
  columns,
  data,
  pageCount,
}: DataTableProps<MonthlyFee, TValue> & { monthlyFee: number }) {
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

  const [openManual, setOpenManual] = useState(false);
  const [openQr, setOpenQr] = useState(false);

  return (
    <DataTable table={table} actionBar={<TableActionBar table={table} />}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2">
          <MonthYearPicker />
        </div>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                تسجيل دفع
                <ChevronDownIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setOpenManual(true)}>
                <PencilSimpleIcon />
                إدخال يدوي
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setOpenQr(true)}>
                <QrCodeIcon />
                مسح رمز QR
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ManualFeeDialog open={openManual} onOpenChange={setOpenManual} />
          <QrScanDialog open={openQr} onOpenChange={setOpenQr} />
        </div>
      </div>
    </DataTable>
  );
}
