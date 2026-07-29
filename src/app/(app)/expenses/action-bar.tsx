"use client";

import type { Table } from "@tanstack/react-table";
import * as React from "react";
import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from "@/features/data-table/components/data-table-action-bar";
import { Separator } from "@/components/ui/separator";
import { TrashIcon } from "@phosphor-icons/react/dist/ssr";
import type { Expense } from "./columns";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

interface ExpensesTableActionBarProps {
  table: Table<Expense>;
}

export function TableActionBar({ table }: ExpensesTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;
  const router = useRouter();

  const { mutateAsync: deleteMutateAsync, isPending: deleteIsPending } =
    api.expenses.delete.useMutation();

  async function deleteSelected() {
    await deleteMutateAsync({ ids: rows.map((row) => row.original.id) });
    router.refresh();
  }

  return (
    <DataTableActionBar table={table} visible={rows.length > 0}>
      <DataTableActionBarSelection table={table} />
      <Separator
        orientation="vertical"
        className="hidden data-[orientation=vertical]:h-5 sm:block"
      />
      <div className="flex items-center gap-1.5">
        <DataTableActionBarAction
          size="icon"
          tooltip="مسح المحدد"
          isPending={deleteIsPending}
          onClick={deleteSelected}
        >
          <TrashIcon />
        </DataTableActionBarAction>
      </div>
    </DataTableActionBar>
  );
}
