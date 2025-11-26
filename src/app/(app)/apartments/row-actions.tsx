"use client";

import ApartmentDetailsDrawer from "@/components/apartment-details-drawer";
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
import type { Owner, Renter, Status } from "@prisma/client";
import { EllipsisIcon, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function RowActions({
  id,
  apartmentNumber,
  status,
  owners,
  renters,
}: {
  id: string;
  apartmentNumber: number;
  status: Status;
  owners: Owner[];
  renters: Renter[];
}) {
  const [openQr, setIsOpenQr] = useState<boolean>(false);
  const [openDetails, setIsOpenDetails] = useState<boolean>(false);

  return (
    <div className="flex items-center gap-2">
      <ApartmentDetailsDrawer
        apartmentNumber={apartmentNumber}
        owners={owners}
        renters={renters}
        status={status}
        open={openDetails}
        setIsOpen={(open) => setIsOpenDetails(open)}
      />
      <Button
        variant="ghost"
        className="data-[state=open]:bg-muted flex size-8 p-0 text-xs"
        size="icon"
        onClick={() => setIsOpenDetails(true)}
      >
        <SquareArrowOutUpRight />
      </Button>
      <QrDialog
        open={openQr}
        setIsOpen={setIsOpenQr}
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
              setIsOpenQr(true);
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
    </div>
  );
}
