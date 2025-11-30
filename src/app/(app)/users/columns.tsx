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
  EnvelopeIcon,
  IdentificationCardIcon,
  RankingIcon,
  UserIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type User = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  avatarUrl: string | null;
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
    meta: {
      mobileType: "select",
    },
  },
  {
    id: "avatar",
    cell: ({ row }) => (
      <Avatar className="rounded-md">
        <AvatarImage src={row.original.avatarUrl ?? undefined} />
        <AvatarFallback className="rounded-md text-xs">
          {row.original.firstName?.[0] ?? "M"}{" "}
          {row.original.lastName?.[0] ?? "T"}
        </AvatarFallback>
      </Avatar>
    ),
    meta: {
      label: "إسم المستخدم",
      variant: "text",
      mobileType: "description",
    },
    enableColumnFilter: true,
    size: 20,
  },
  {
    accessorKey: "username",
    header: "إسم المستخدم",
    accessorFn: ({ username }) => `${username}@`,
    meta: {
      label: "إسم المستخدم",
      variant: "text",
      icon: IdentificationCardIcon,
      mobileType: "description",
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "firstName",
    header: "الإسم الأول",
    enableColumnFilter: true,
  },
  {
    accessorKey: "lastName",
    header: "الإسم الأخير",
    enableColumnFilter: true,
  },
  {
    id: "name",
    header: "الإسم",
    cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
    meta: {
      mobileType: "title",
      icon: UserIcon,
    },
  },
  {
    accessorKey: "email",
    header: "البريد الإليكتروني",
    meta: {
      label: "البريد الإلكتروني",
      variant: "text",
      icon: EnvelopeIcon,
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
      mobileType: "action",
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
    // enableColumnFilter: true,
  },

  // Row actions (⋮ dropdown)
  {
    id: "actions",
    cell: ({ row }) =>
      row.original.role !== "admin" ? (
        <UserRowActions user={row.original} />
      ) : null,

    size: 30,
  },
];
