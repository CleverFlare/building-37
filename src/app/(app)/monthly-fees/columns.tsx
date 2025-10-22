"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import type { State } from "@prisma/client";
import {
  CalendarDotsIcon,
  CoinsIcon,
  DoorIcon,
  HouseIcon,
  PhoneIcon,
  UserIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Chip } from "@/components/ui/chip";
import { mapToVariant } from "@/lib/map-to-variant";
import type { ComponentProps } from "react";
import { arabicStates } from "@/config/apartment-arabic-state";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { RowActions } from "./row-actions";

export type MonthlyFee = {
  id: string;
  apartmentNumber: number;
  ownerName: string;
  ownerPhone: string;
  occupantName: string | null;
  occupantPhone: string | null;
  paidAmount: number;
  state: State;
  createdAt: Date;
};

// ✅ Define columns for Dice UI DataTable
export const columns: ColumnDef<MonthlyFee>[] = [
  // Selection column
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
    meta: {
      mobileType: "select",
    },
  },
  {
    accessorKey: "paidAmount",
    header: "المبلغ المدفوع",
    accessorFn: ({ paidAmount }) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EGP",
      }).format(paidAmount),
    meta: {
      icon: CoinsIcon,
      mobileType: "title",
    },
  },
  {
    accessorKey: "apartmentNumber",
    header: "رقم الشقة",
    meta: {
      label: "رقم الشقة",
      variant: "number",
      icon: DoorIcon,
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "ownerName",
    header: "إسم المالك",
    meta: {
      icon: UserIcon,
    },
  },
  {
    accessorKey: "ownerPhone",
    header: "رقم هاتف المالك",
    meta: {
      label: "رقم هاتف المالك",
      variant: "text",
      icon: PhoneIcon,
    },
    enableColumnFilter: true,
    cell: ({
      row: {
        original: { ownerPhone },
      },
    }) => {
      return <span dir="ltr">{ownerPhone}</span>;
    },
  },
  {
    id: "state",
    header: "حالة الشقة",
    cell: ({
      row: {
        original: { state },
      },
    }) => (
      <Chip
        variant={mapToVariant<
          ComponentProps<typeof Chip>["variant"],
          typeof state
        >(
          {
            occupied: "heavy",
            rented: "medium",
            vacant: "light",
          },
          "light",
          state,
        )}
      >
        {arabicStates[state]}
      </Chip>
    ),
    meta: {
      label: "حالة الشقة",
      variant: "select",
      icon: HouseIcon,
      options: [
        {
          label: "فارغة",
          value: "vacant",
        },
        {
          label: "مسكونة",
          value: "occupied",
        },
        {
          label: "مؤجرة",
          value: "rented",
        },
      ],
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "occupantName",
    header: "إسم الساكن",
    cell: ({
      row: {
        original: { occupantName, state },
      },
    }) =>
      state === "rented" ? (
        (occupantName ?? <p className="text-muted-foreground">غير معروف</p>)
      ) : (
        <p className="text-muted-foreground">-</p>
      ),
    meta: {
      label: "إسم الساكن",
      placeholder: "بحث في إسم الساكن...",
      variant: "text",
      icon: UserIcon,
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "occupantPhone",
    header: "رقم هاتف الساكن",
    cell: ({
      row: {
        original: { occupantPhone, state },
      },
    }) => {
      return state === "rented" ? (
        occupantPhone ? (
          <span dir="ltr">{occupantPhone}</span>
        ) : (
          <p className="text-muted-foreground">لا يوجد</p>
        )
      ) : (
        <p className="text-muted-foreground">-</p>
      );
    },
    meta: {
      label: "رقم هاتف الساكن",
      variant: "text",
      icon: PhoneIcon,
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
    }) => format(createdAt, "dd MMM yyyy - mm : h aaa", { locale: ar }),
    meta: {
      label: "تاريخ الإضافة",
      variant: "date",
      icon: CalendarDotsIcon,
      mobileType: "description",
    },
    enableColumnFilter: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <RowActions id={row.original.id} />,
    meta: {
      mobileType: "action",
    },
  },
];
