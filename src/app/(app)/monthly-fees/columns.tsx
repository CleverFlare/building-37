"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import type { State } from "@prisma/client";
import {
  CalendarDotsIcon,
  CoinsIcon,
  DoorIcon,
  HouseIcon,
  KeyIcon,
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
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type MonthlyFee = {
  id: string;
  apartmentNumber: number;
  ownerName: string;
  ownerPhone: string;
  renterName: string | null;
  renterPhone: string | null;
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
    id: "owner",
    header: "المالك",
    cell: ({ row }) => (
      <span className="flex flex-col gap-1">
        <p>{row.original.ownerName}</p>
        <p className="text-muted-foreground text-sm">
          {row.original.ownerPhone}
        </p>
      </span>
    ),
    meta: {
      icon: KeyIcon,
      hide: {
        desktop: false,
        mobile: true,
      },
    },
  },
  {
    accessorKey: "ownerName",
    header: "إسم المالك",
    meta: {
      mobileType: "title",
      icon: UserIcon,
      hide: {
        desktop: true,
        mobile: false,
      },
    },
  },
  {
    accessorKey: "ownerPhone",
    header: "رقم هاتف المالك",
    meta: {
      label: "رقم هاتف المالك",
      variant: "text",
      icon: PhoneIcon,
      mobileType: "description",
      hide: {
        mobile: false,
        desktop: true,
      },
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
    id: "status",
    header: "حالة الشقة",
    cell: ({
      row: {
        original: { state },
      },
    }) => (
      <Badge variant="outline" className="gap-2">
        <span
          className={cn(
            "size-2 rounded-full",
            "bg-gray-500",
            state === "vacant" && "bg-secondary",
            state === "rented" && "bg-green-500",
            state === "occupied" && "bg-primary",
          )}
        />
        {arabicStates[state]}
      </Badge>
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
    id: "renter",
    header: "المستأجر",
    cell: ({ row }) =>
      row.original.renterName && row.original.renterPhone ? (
        <span className="flex flex-col gap-1">
          <p>{row.original.renterName}</p>
          <p className="text-muted-foreground text-sm">
            {row.original.renterPhone}
          </p>
        </span>
      ) : (
        "-"
      ),
    meta: {
      icon: UserIcon,
      hide: {
        desktop: false,
        mobile: true,
      },
    },
  },
  {
    accessorKey: "renterName",
    header: "إسم المستأجر",
    cell: ({
      row: {
        original: { renterName, state },
      },
    }) =>
      state === "rented" ? (
        (renterName ?? <p className="text-muted-foreground">غير معروف</p>)
      ) : (
        <p className="text-muted-foreground">-</p>
      ),
    meta: {
      label: "إسم المستأجر",
      placeholder: "بحث في إسم المستأجر...",
      variant: "text",
      icon: UserIcon,
      hide: {
        desktop: true,
        mobile: false,
      },
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "renterPhone",
    header: "رقم هاتف المستأجر",
    cell: ({
      row: {
        original: { renterPhone, state },
      },
    }) => {
      return state === "rented" ? (
        renterPhone ? (
          <span dir="ltr">{renterPhone}</span>
        ) : (
          <p className="text-muted-foreground">لا يوجد</p>
        )
      ) : (
        <p className="text-muted-foreground">-</p>
      );
    },
    meta: {
      label: "رقم هاتف المستأجر",
      variant: "text",
      icon: PhoneIcon,
      hide: {
        desktop: true,
        mobile: false,
      },
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
