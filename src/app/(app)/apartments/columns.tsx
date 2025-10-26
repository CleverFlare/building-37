"use client";

import DeleteApartmentDropdownItem from "@/components/delete-apartment-dropdown-item";
import QrDialog from "@/components/qr-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Chip } from "@/components/ui/chip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { arabicStates } from "@/config/apartment-arabic-state";
import { mapToVariant } from "@/lib/map-to-variant";
import { cn } from "@/lib/utils";
import {
  CalendarDotsIcon,
  DoorIcon,
  HouseIcon,
  KeyIcon,
  PenIcon,
  PhoneIcon,
  QrCodeIcon,
  SlidersHorizontalIcon,
  TextIndentIcon,
  UserIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { State } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { EllipsisIcon } from "lucide-react";
import Link from "next/link";
import { useState, type ComponentProps } from "react";
import { RowActions } from "./row-actions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Apartment = {
  id: string;
  apartmentNumber: number;
  ownerName: string;
  ownerPhone: string;
  renterName: string | null;
  renterPhone: string | null;
  state: State;
  createdAt: Date;
};

export const columns: ColumnDef<Apartment>[] = [
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
    },
    enableColumnFilter: true,
  },

  // Row actions (⋮ dropdown)
  {
    id: "actions",
    cell: ({ row }) => (
      <RowActions
        id={row.original.id}
        apartmentNumber={row.original.apartmentNumber}
      />
    ),

    size: 30,
    meta: {
      mobileType: "action",
    },
  },
];
