"use client";

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTableFilterList } from "@/features/data-table/components/data-table-filter-list";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/features/data-table/components/data-table";
import { useDataTable } from "@/features/data-table/hooks/use-data-table";
import { TableActionBar } from "./action-bar";
import type { Expense } from "./columns";
import MonthYearPicker from "@/components/nuqs-month-picker";
import AddExpenseDialog from "@/components/add-expense-dialog";
import { parseAsInteger, useQueryState } from "nuqs";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  totalAmount: number;
}

export function ExpensesTable<TValue>({
  columns,
  data,
  pageCount,
  totalAmount,
}: DataTableProps<Expense, TValue>) {
  const { table, shallow, debounceMs, throttleMs } = useDataTable({
    pageCount,
    data,
    columns,
    clearOnDefault: true,
    enableAdvancedFilter: true,
    shallow: false,
  });

  const [open, setOpen] = useState(false);

  const [month] = useQueryState(
    "month",
    parseAsInteger.withDefault(new Date().getMonth()),
  );
  const [year] = useQueryState(
    "year",
    parseAsInteger.withDefault(new Date().getFullYear()),
  );

  return (
    <>
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
            <Button onClick={() => setOpen(true)}>
              <PlusIcon />
              إضافة مصروف
            </Button>
          </div>
        </div>
      </DataTable>
      <div className="flex items-center justify-end rounded-md border px-4 py-3 text-sm">
        <span className="text-muted-foreground me-2">إجمالي المصروفات:</span>
        <span className="font-semibold">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "EGP",
          }).format(totalAmount)}
        </span>
      </div>
      <AddExpenseDialog
        open={open}
        onOpenChange={setOpen}
        month={month}
        year={year}
      />
    </>
  );
}
