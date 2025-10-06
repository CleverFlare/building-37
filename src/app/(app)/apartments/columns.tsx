"use client";

import DeleteApartmentDropdownItem from "@/components/delete-apartment-dropdown-item";
import QrDialog from "@/components/qr-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CalendarDotsIcon,
  CheckIcon,
  HouseLineIcon,
  PenIcon,
  PhoneIcon,
  QrCodeIcon,
  SlidersHorizontalIcon,
  TextIndentIcon,
  ToggleLeftIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { EllipsisIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Apartment = {
  id: string;
  apartmentNumber: number;
  ownerName: string;
  ownerPhone: string;
  occupantName: string | null;
  occupantPhone: string | null;
  isRented: boolean;
  isOccupied: boolean;
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
    accessorKey: "isRented",
    header: "مؤجرة؟",
    cell: ({
      row: {
        original: { isRented },
      },
    }) => (
      <Badge variant={isRented ? "secondary" : "outline"}>
        {isRented ? <CheckIcon /> : <XIcon />}{" "}
        {isRented ? "مؤجرة" : "غير مؤجرة"}
      </Badge>
    ),
    meta: {
      label: "مؤجرة؟",
      variant: "boolean",
      icon: ToggleLeftIcon,
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "occupantName",
    header: "إسم الساكن",
    cell: ({
      row: {
        original: { occupantName, isOccupied },
      },
    }) =>
      isOccupied ? (
        (occupantName ?? <p className="text-muted-foreground">غير معروف</p>)
      ) : (
        <p className="text-muted-foreground">غير مسكونة</p>
      ),
    meta: {
      label: "إسم الساكن",
      placeholder: "بحث في إسم الساكن...",
      variant: "text",
      icon: TextIndentIcon,
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "occupantPhone",
    header: "رقم هاتف الساكن",
    cell: ({
      row: {
        original: { occupantPhone, isOccupied },
      },
    }) => {
      return isOccupied ? (
        occupantPhone ? (
          <span dir="ltr">{occupantPhone}</span>
        ) : (
          <p className="text-muted-foreground">لا يوجد</p>
        )
      ) : (
        <p className="text-muted-foreground">غير مسكونة</p>
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
    id: "isOccupied",
    accessorKey: "occupied",
    header: "مسكونة؟",
    cell: ({
      row: {
        original: { isOccupied },
      },
    }) => (
      <span
        className="flex size-5 items-center justify-center rounded text-white"
        style={{
          backgroundColor: isOccupied ? "#22c55e" : "#ef4444",
        }}
      >
        {isOccupied ? <CheckIcon /> : <XIcon />}
      </span>
    ),
    meta: {
      label: "مسكونة؟",
      variant: "boolean",
      icon: HouseLineIcon,
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
  },
];
