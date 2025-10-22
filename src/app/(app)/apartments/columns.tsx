"use client";

import DeleteApartmentDropdownItem from "@/components/delete-apartment-dropdown-item";
import QrDialog from "@/components/qr-dialog";
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
import {
  CalendarDotsIcon,
  DoorIcon,
  HouseIcon,
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

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Apartment = {
  id: string;
  apartmentNumber: number;
  ownerName: string;
  ownerPhone: string;
  occupantName: string | null;
  occupantPhone: string | null;
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
    accessorKey: "ownerName",
    header: "إسم المالك",
    meta: {
      mobileType: "title",
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
      mobileType: "description",
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
    },
    enableColumnFilter: true,
  },
  {
    id: "actions",
    cell: function Cell({
      row: {
        original: { id, apartmentNumber },
      },
    }) {
      const [open, setIsOpen] = useState<boolean>(false);
      return (
        <>
          <QrDialog
            open={open}
            setIsOpen={setIsOpen}
            apartmentNumber={apartmentNumber}
          />
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="data-[state=open]:bg-muted flex size-8 p-0"
              >
                <EllipsisIcon className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                <QrCodeIcon />
                QR
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/apartments/edit/${id}`}>
                  <PenIcon />
                  تعديل
                </Link>
              </DropdownMenuItem>
              <DeleteApartmentDropdownItem id={id} />
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
    size: 30,

    meta: {
      mobileType: "action",
    },
  },
];
