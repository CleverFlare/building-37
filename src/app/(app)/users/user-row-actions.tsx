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
  ArrowClockwiseIcon,
  PenIcon,
  TrashIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import { UserForm } from "./user-form";
import { useState } from "react";
import AlertDialog from "@/components/alert-dialog";

export function UserRowActions({ user }: { user: User }) {
  const { mutateAsync: deleteUsers, isPending: deleting } =
    api.users.deleteMany.useMutation();

  const { mutateAsync: transferAdmin, isPending: transferring } =
    api.users.transferAdmin.useMutation();

  const router = useRouter();

  async function handleDelete() {
    try {
      await deleteUsers([{ id: user.id }]);
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleTransferAdmin() {
    if (user.role === "admin") return null;
    try {
      await transferAdmin({ id: user.id });
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  }

  const [openEdit, setOpenEdit] = useState<boolean>(false);

  const [openTransferAlert, setOpenTransferAlert] = useState<boolean>(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState<boolean>(false);

  return (
    <>
      <UserForm
        open={openEdit}
        onOpenChange={(val) => setOpenEdit(val)}
        id={user.id}
        defaultValues={{
          role: user.role as "user" | "moderator",
          username: user.username,
          lastName: user.lastName,
          firstName: user.firstName,
          email: user.email,
        }}
      />
      <AlertDialog
        open={openTransferAlert}
        onOpenChange={(val) => setOpenTransferAlert(val)}
        onYes={() => handleTransferAdmin()}
        isPending={transferring}
        description="سوف يتم نقل مسؤولية النظام إلى مستخدم آخر ولا يمكنك إسترجاعه مرة أخرى إلا من خلال هذا المستخدم فقط."
      />
      <AlertDialog
        open={openDeleteAlert}
        onOpenChange={(val) => setOpenDeleteAlert(val)}
        onYes={() => handleDelete()}
        isPending={deleting}
        description="هذه العملية غير قابلة للعكس، سوف يتم مسح المستخدم بشكل نهائي وبياناته سوف تحذف تماماً من خوادمنا."
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setOpenEdit(true)}>
            <PenIcon /> تعديل البيانات
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={transferring}
            onClick={() => setOpenTransferAlert(true)}
            variant="destructive"
          >
            <ArrowClockwiseIcon /> تحويل لمدير
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            disabled={deleting}
            onClick={() => setOpenDeleteAlert(true)}
          >
            <TrashIcon className="text-destructive" /> مسح
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
