"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { UserRowActions } from "./user-row-actions";
import type { Role } from "@prisma/client";
import { format } from "date-fns";
import { Span } from "next/dist/trace";
import { ar } from "date-fns/locale";

export type User = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  createdAt: Date;
};

// ✅ Define columns for Dice UI DataTable
export const columns: ColumnDef<User>[] = [
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
  },
  {
    accessorKey: "username",
    header: "إسم المستخدم",
  },
  {
    id: "name",
    header: "الإسم",
    cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
  },
  {
    accessorKey: "email",
    header: "البريد الإليكتروني",
  },
  {
    accessorKey: "role",
    header: "الوظيفة",
    cell: ({ row }) => {
      // eslint-disable-next-line
      const role = row.original.role;
      const color =
        role === "admin"
          ? "bg-red-500/10 text-red-600"
          : role === "moderator"
            ? "bg-blue-500/10 text-blue-600"
            : "bg-gray-500/10 text-gray-600";

      const arabicRoles: Record<Role, string> = {
        admin: "مسؤول النظام",
        moderator: "مدير",
        user: "مستخدم",
      };

      return (
        // eslint-disable-next-line
        <Badge className={`${color} capitalize`}>{arabicRoles[role]}</Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "تاريخ الإنضمام",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return format(date, "dd MMM yyyy - mm : h aaa", { locale: ar });
    },
  },

  // Row actions (⋮ dropdown)
  {
    id: "actions",
    cell: ({ row }) => <UserRowActions user={row.original} />,
  },
];
