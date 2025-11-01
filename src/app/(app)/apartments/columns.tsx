"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { arabicStates } from "@/config/apartment-arabic-state";
import { cn } from "@/lib/utils";
import {
  CalendarDotsIcon,
  DoorIcon,
  HouseIcon,
  KeyIcon,
  PhoneIcon,
  UserIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { Owner, Renter, Status } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { RowActions } from "./row-actions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Apartment = {
  id: string;
  apartmentNumber: number;
  owners: Owner;
  renters?: Renter;
  status: Status;
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
        <p>{row.original.owners.name}</p>
        <p className="text-muted-foreground text-sm">
          {row.original.owners.phone}
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
    id: "ownerName",
    header: "إسم المالك",
    accessorFn: (row) => row.owners.name,
    meta: {
      label: "إسم المالك",
      mobileType: "title",
      icon: UserIcon,
      variant: "text",
      hide: {
        desktop: true,
        mobile: false,
      },
    },
  },
  {
    id: "ownerPhone",
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
    cell: ({
      row: {
        original: { owners },
      },
    }) => {
      return <span dir="ltr">{owners.phone}</span>;
    },
    enableColumnFilter: true,
  },
  {
    id: "status",
    header: "حالة الشقة",
    cell: ({
      row: {
        original: { status },
      },
    }) => (
      <Badge variant="outline" className="gap-2">
        <span
          className={cn(
            "size-2 rounded-full",
            "bg-gray-500",
            status === "vacant" && "bg-secondary",
            status === "occupied" && "bg-primary",
          )}
        />
        {arabicStates[status]}
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
      row.original?.renters?.name && row.original?.renters?.phone ? (
        <span className="flex flex-col gap-1">
          <p>{row.original.renters.name}</p>
          <p className="text-muted-foreground text-sm">
            {row.original.renters.phone}
          </p>
        </span>
      ) : (
        "غير مؤجرة"
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
    id: "renterName",
    header: "إسم المستأجر",
    accessorFn: (row) => row.renters?.phone ?? "غير مؤجرة",
    meta: {
      label: "إسم المستأجر",
      mobileType: "title",
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
    id: "renterPhone",
    header: "رقم هاتف المستأجر",
    meta: {
      label: "رقم هاتف المستأجر",
      variant: "text",
      icon: PhoneIcon,
      mobileType: "description",
      hide: {
        mobile: false,
        desktop: true,
      },
    },
    cell: ({
      row: {
        original: { renters },
      },
    }) => {
      return <span dir="ltr">{renters?.phone ?? "غير مؤجرة"}</span>;
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
