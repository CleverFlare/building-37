"use client";

import DeleteApartmentDropdownItem from "@/components/delete-apartment-dropdown-item";
import QrDialog from "@/components/qr-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PenIcon, QrCodeIcon } from "@phosphor-icons/react/dist/ssr";
import { EllipsisIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function RowActions({
  id,
  apartmentNumber,
}: {
  id: string;
  apartmentNumber: number;
}) {
  const [open, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <QrDialog
        open={open}
        setIsOpen={setIsOpen}
        apartmentNumber={apartmentNumber}
      />
      <DropdownMenu>
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
            onClick={(e) => {
              e.stopPropagation();
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
}
