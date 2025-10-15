"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { TrashIcon } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";

export function RowActions({ id }: { id: string }) {
  const { mutateAsync, isPending } = api.monthlyFees.delete.useMutation();

  const router = useRouter();

  async function handleDelete() {
    try {
      await mutateAsync({ ids: [id] });
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Button
      variant="destructive"
      onClick={() => handleDelete()}
      disabled={isPending}
    >
      <TrashIcon />
    </Button>
  );
}
