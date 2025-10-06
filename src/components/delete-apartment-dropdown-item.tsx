import { TrashIcon } from "@phosphor-icons/react/dist/ssr";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { api } from "@/trpc/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeleteApartmentDropdownItem({ id }: { id: string }) {
  const { mutateAsync, isPending } = api.apartments.delete.useMutation();

  const router = useRouter();

  async function handleClick() {
    await mutateAsync([{ id }]);

    router.refresh();
  }

  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={handleClick}
      variant="destructive"
    >
      {isPending ? <Loader2 className="animate-spin" /> : <TrashIcon />}
      مسح
    </DropdownMenuItem>
  );
}
