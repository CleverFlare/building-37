"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CalendarDotsIcon,
  CoinsIcon,
  TagIcon,
} from "@phosphor-icons/react/dist/ssr";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { RowActions } from "./row-actions";

export type Expense = {
  id: string;
  label: string;
  amount: number;
  month: number;
  year: number;
  createdAt: Date;
};

export const columns: ColumnDef<Expense>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center px-2">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center px-2">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    size: 10,
    meta: { mobileType: "select" },
  },
  {
    accessorKey: "label",
    header: "البيان",
    meta: {
      label: "البيان",
      variant: "text",
      icon: TagIcon,
      mobileType: "title",
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "amount",
    header: "المبلغ",
    accessorFn: ({ amount }) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EGP",
      }).format(amount),
    meta: {
      label: "المبلغ",
      variant: "number",
      icon: CoinsIcon,
      mobileType: "description",
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "createdAt",
    header: "تاريخ الإضافة",
    cell: ({
      row: {
        original: { createdAt },
      },
    }) => format(createdAt, "dd MMM yyyy", { locale: ar }),
    meta: {
      label: "تاريخ الإضافة",
      variant: "date",
      icon: CalendarDotsIcon,
    },
    enableColumnFilter: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <RowActions id={row.original.id} />,
    meta: { mobileType: "action" },
  },
];
