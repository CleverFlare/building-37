"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { UserRowActions } from "./user-row-actions";
import type { Role } from "@prisma/client";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Chip } from "@/components/ui/chip";
import { mapToVariant } from "@/lib/map-to-variant";
import type { ComponentProps } from "react";
import {
  CalendarIcon,
  MailboxIcon,
  PersonIcon,
  RankingIcon,
  UserIcon,
} from "@phosphor-icons/react/dist/ssr";

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
    meta: {
      label: "إسم المستخدم",
      variant: "text",
      icon: UserIcon,
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "firstName",
    header: "الإسم الأول",
    meta: {
      label: "الإسم الأول",
      variant: "text",
      icon: PersonIcon,
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "lastName",
    header: "الإسم الأخير",
    meta: {
      label: "الإسم الأخير",
      variant: "text",
      icon: PersonIcon,
    },
    enableColumnFilter: true,
  },
  {
    id: "name",
    header: "الإسم",
    cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
  },
  {
    accessorKey: "email",
    header: "البريد الإليكتروني",
    meta: {
      label: "البريد الإلكتروني",
      variant: "text",
      icon: MailboxIcon,
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "role",
    header: "الوظيفة",
    cell: ({ row }) => {
      const role = row.original.role;

      const arabicRoles: Record<Role, string> = {
        admin: "مسؤول النظام",
        moderator: "مدير",
        user: "مستخدم",
      };

      return (
        <Chip
          variant="medium"
          color={mapToVariant<
            ComponentProps<typeof Chip>["color"],
            typeof role
          >(
            {
              admin: "destructive",
              user: "warning",
              moderator: "primary",
            },
            "primary",
            role,
          )}
        >
          {arabicRoles[role]}
        </Chip>
      );
    },
    meta: {
      label: "الوظيفة",
      variant: "select",
      options: [
        {
          label: "مسؤول النظام",
          value: "admin",
        },
        {
          label: "مدير",
          value: "moderator",
        },
        {
          label: "مستخدم",
          value: "user",
        },
      ],
      icon: RankingIcon,
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "createdAt",
    header: "تاريخ الإنضمام",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return format(date, "dd MMM yyyy - mm : h aaa", { locale: ar });
    },
    meta: {
      label: "تاريخ الإنضمام",
      variant: "date",
      icon: CalendarIcon,
    },
    enableColumnFilter: true,
  },

  // Row actions (⋮ dropdown)
  {
    id: "actions",
    cell: ({ row }) => <UserRowActions user={row.original} />,
  },
];
