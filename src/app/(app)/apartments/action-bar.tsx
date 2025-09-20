"use client";

import type { Table } from "@tanstack/react-table";
import * as React from "react";
import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from "@/features/data-table/components/data-table-action-bar";
import { Separator } from "@/components/ui/separator";
import { FilePdfIcon, TrashIcon } from "@phosphor-icons/react/dist/ssr";
import type { Apartment } from "./columns";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

interface TasksTableActionBarProps {
  table: Table<Apartment>;
}

export function TableActionBar({ table }: TasksTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;

  const router = useRouter();

  const { mutateAsync: qrPdfMutateAsync, isPending: qrPdfIsPending } =
    api.apartments.qrPdf.useMutation();

  async function handleQrPdfDownload() {
    const res = await qrPdfMutateAsync(
      rows.map((row) => ({
        qrData: row.original.apartmentNumber + "",
        apartmentNumber: row.original.apartmentNumber,
      })),
    );

    // Turn base64 back into a Blob
    const byteChars = atob(res.pdf);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
      byteNumbers[i] = byteChars.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    // Trigger download
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qr.pdf";
    a.click();
    URL.revokeObjectURL(url);
  }

  const { mutateAsync: deleteMutateAsync, isPending: deleteIsPending } =
    api.apartments.delete.useMutation();

  async function deleteSelected() {
    await deleteMutateAsync(rows.map((row) => ({ id: row.original.id })));

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
          tooltip="طباعة QR"
          isPending={qrPdfIsPending}
          onClick={handleQrPdfDownload}
        >
          <FilePdfIcon />
        </DataTableActionBarAction>
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
