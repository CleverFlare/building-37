"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { api } from "@/trpc/react";
import type { User } from "./columns";
import {
  DetectiveIcon,
  TrashIcon,
  UserIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import type { Role } from "@prisma/client";

export function UserRowActions({ user }: { user: User }) {
  const { mutateAsync: deleteUsers, isPending: deleting } =
    api.users.deleteMany.useMutation();

  const { mutateAsync: updateRole, isPending: updatingRole } =
    api.users.updateRole.useMutation();

  const router = useRouter();

  async function handleRoleChange(id: string, role: Role) {
    try {
      await updateRole([
        {
          id: id,
          // eslint-disable-next-line
          role,
        },
      ]);

      router.refresh();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteUsers([{ id: user.id }]);
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          disabled={updatingRole}
          onClick={() => handleRoleChange(user.id, "moderator")}
        >
          <DetectiveIcon /> تحويل لمدير
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={updatingRole}
          onClick={() => handleRoleChange(user.id, "user")}
        >
          <UserIcon /> تحويل لمستخدم
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive"
          disabled={deleting}
          onClick={() => handleDelete(user.id)}
        >
          <TrashIcon className="text-destructive" /> مسح
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
