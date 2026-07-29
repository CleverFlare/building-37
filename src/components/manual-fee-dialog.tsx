"use client";

import { useState } from "react";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "./ui/credenza";
import { Button } from "./ui/button";
import { PencilSimpleIcon } from "@phosphor-icons/react/dist/ssr";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Spinner } from "./ui/spinner";

interface ManualFeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ManualFeeDialog({
  open,
  onOpenChange,
}: ManualFeeDialogProps) {
  const [comboOpen, setComboOpen] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  const router = useRouter();

  const { data: apartments = [], isLoading } =
    api.monthlyFees.getUnpaidApartments.useQuery(undefined, { enabled: open });

  const { mutateAsync, isPending } = api.monthlyFees.scanApartment.useMutation({
    onSuccess: () => {
      router.refresh();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function handleOpenChange(value: boolean) {
    onOpenChange(value);
    if (!value) setSelectedNumber(null);
  }

  async function submit() {
    if (selectedNumber === null) return;
    await mutateAsync({ apartmentNumber: String(selectedNumber) });
  }

  const selected = apartments.find((a) => a.apartmentNumber === selectedNumber);

  return (
    <Credenza open={open} onOpenChange={handleOpenChange}>
      <CredenzaContent>
        <CredenzaHeader>
          <span className="border-input bg-input/50 relative mx-auto mb-2 flex size-12 items-center justify-center overflow-hidden rounded-full border dark:bg-[#0f0f0f] dark:text-white">
            <div
              className="absolute inset-0 z-0 h-full w-full"
              style={{
                backgroundImage: `
                  linear-gradient(to right, var(--border) 1px, transparent 1px),
                  linear-gradient(to bottom, var(--border) 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px",
              }}
            />
            <PencilSimpleIcon size={25} className="z-10" />
          </span>
          <CredenzaTitle className="text-center">إدخال يدوي</CredenzaTitle>
          <CredenzaDescription className="text-center">
            اختر الشقة لتسجيل عملية الدفع يدوياً
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <Popover open={comboOpen} onOpenChange={setComboOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={comboOpen}
                className="w-full justify-between"
              >
                {selected
                  ? `شقة رقم ${selected.apartmentNumber} — ${selected.ownerName}`
                  : "اختر شقة..."}
                <ChevronsUpDownIcon className="size-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[--radix-popover-trigger-width] p-0"
              align="start"
            >
              <Command>
                <CommandInput placeholder="ابحث برقم الشقة أو اسم المالك..." />
                <CommandList>
                  <CommandEmpty>
                    {isLoading ? "جاري التحميل..." : "لا توجد شقق غير مدفوعة"}
                  </CommandEmpty>
                  <CommandGroup>
                    {apartments.map((apt) => (
                      <CommandItem
                        key={apt.apartmentNumber}
                        value={`${apt.apartmentNumber} ${apt.ownerName}`}
                        onSelect={() => {
                          setSelectedNumber(apt.apartmentNumber);
                          setComboOpen(false);
                        }}
                      >
                        <CheckIcon
                          className={cn(
                            "size-4",
                            selectedNumber === apt.apartmentNumber
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        شقة رقم {apt.apartmentNumber} — {apt.ownerName}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button variant="outline">خروج</Button>
          </CredenzaClose>
          <Button
            onClick={submit}
            disabled={selectedNumber === null || isPending}
          >
            {isPending && <Spinner />}
            تسجيل الدفع
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
