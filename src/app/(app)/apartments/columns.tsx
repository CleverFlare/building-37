"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  CalendarDotsIcon,
  CheckIcon,
  SlidersHorizontalIcon,
  TextIndentIcon,
  ToggleLeftIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import { type ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Apartment = {
  id: string;
  apartmentNumber: number;
  ownerName: string;
  occupantName: string | null;
  isRented: boolean;
  createdAt: Date;
};

export const columns: ColumnDef<Apartment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
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
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    size: 10,
  },
  {
    accessorKey: "apartmentNumber",
    header: "رقم الشقة",
    meta: {
      label: "رقم الشقة",
      variant: "number",
      icon: SlidersHorizontalIcon,
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "ownerName",
    header: "إسم المالك",
  },
  {
    accessorKey: "occupantName",
    header: "إسم الساكن",
    cell: ({
      row: {
        original: { occupantName },
      },
    }) => occupantName ?? <p className="text-muted-foreground">غير مسكونة</p>,
    meta: {
      label: "مسكونة؟",
      variant: "boolean",
      icon: ToggleLeftIcon,
    },
    enableColumnFilter: true,
  },
  {
    id: "searchableOccupantName",
    accessorKey: "occupantName",
    header: "إسم الساكن",
    cell: ({
      row: {
        original: { occupantName },
      },
    }) => occupantName ?? <p className="text-muted-foreground">غير مسكونة</p>,
    meta: {
      label: "إسم الساكن",
      placeholder: "بحث في إسم الساكن...",
      variant: "text",
      icon: TextIndentIcon,
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "isRented",
    header: "مؤجرة؟",
    cell: ({
      row: {
        original: { isRented },
      },
    }) => (
      <span
        className="flex size-5 items-center justify-center rounded text-white"
        style={{
          backgroundColor: isRented ? "#22c55e" : "#ef4444",
        }}
      >
        {isRented ? <CheckIcon /> : <XIcon />}
      </span>
    ),
    meta: {
      label: "مؤجرة؟",
      variant: "boolean",
      icon: ToggleLeftIcon,
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "createdAt",
    header: "تاريخ الإضافة",
    meta: {
      label: "تاريخ الإضافة",
      variant: "date",
      icon: CalendarDotsIcon,
    },
    enableColumnFilter: true,
  },
];
