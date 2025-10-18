"use client";

import type { Table } from "@tanstack/react-table";
import * as React from "react";

import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from "@/features/data-table/components/data-table-action-bar";

import { Separator } from "@/components/ui/separator";
import {
  DetectiveIcon,
  TrashIcon,
  UserIcon,
  UserSwitchIcon,
} from "@phosphor-icons/react/dist/ssr";

import type { Role } from "@prisma/client";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import type { User } from "./columns";

interface UsersTableActionBarProps {
  table: Table<User>;
}

export function TableActionBar({ table }: UsersTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;
  const router = useRouter();

  const { mutateAsync: deleteUsers, isPending: deleting } =
    api.users.deleteMany.useMutation();

  const { mutateAsync: updateRole, isPending: updatingRole } =
    api.users.updateRole.useMutation();

  async function handleDeleteSelected() {
    if (rows.length === 0) return;
    try {
      await deleteUsers(rows.map((row) => ({ id: row.original.id })));
      toast.success("Selected users deleted successfully.");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete users.");
    }
  }

  async function handleRoleChange(role: Role) {
    if (rows.length === 0) return;
    try {
      await updateRole(
        rows.map((row) => ({
          id: row.original.id,
          role,
        })),
      );
      toast.success(`Updated role to "${role}" for ${rows.length} users.`);
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update roles.");
    }
  }

  return (
    <DataTableActionBar table={table} visible={rows.length > 0}>
      <DataTableActionBarSelection table={table} />

      <Separator
        orientation="vertical"
        className="hidden data-[orientation=vertical]:h-5 sm:block"
      />

      <div className="flex items-center gap-1.5">
        {/* Change Role Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <DataTableActionBarAction tooltip="تغير الوظيفة" size="icon">
              <UserSwitchIcon />
            </DataTableActionBarAction>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleRoleChange("moderator")}>
              <DetectiveIcon className="mr-2" /> مدير
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleRoleChange("user")}>
              <UserIcon className="mr-2" /> مستخدم
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Delete Selected */}
        <DataTableActionBarAction
          size="icon"
          tooltip="مسح المحدد"
          isPending={deleting}
          onClick={handleDeleteSelected}
        >
          <TrashIcon />
        </DataTableActionBarAction>
      </div>
    </DataTableActionBar>
  );
}
