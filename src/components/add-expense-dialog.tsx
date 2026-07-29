"use client";

import { useEffect, useState } from "react";
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
import { ReceiptIcon } from "@phosphor-icons/react/dist/ssr";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Spinner } from "./ui/spinner";

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  month: number;
  year: number;
}

export default function AddExpenseDialog({
  open,
  onOpenChange,
  month,
  year,
}: AddExpenseDialogProps) {
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (!open) {
      setLabel("");
      setAmount("");
    }
  }, [open]);

  const { mutateAsync, isPending } = api.expenses.create.useMutation({
    onSuccess: () => {
      router.refresh();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  async function submit() {
    const parsedAmount = parseInt(amount, 10);
    if (!label.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;
    await mutateAsync({ label: label.trim(), amount: parsedAmount, month, year });
  }

  const isValid = label.trim().length > 0 && parseInt(amount, 10) > 0;

  return (
    <Credenza open={open} onOpenChange={onOpenChange}>
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
            <ReceiptIcon size={25} className="z-10" />
          </span>
          <CredenzaTitle className="text-center">إضافة مصروف</CredenzaTitle>
          <CredenzaDescription className="text-center">
            أدخل بيان المصروف والمبلغ المخصوم
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="expense-label">البيان</Label>
            <Input
              id="expense-label"
              placeholder="مثال: صيانة المصعد"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="expense-amount">المبلغ (جنية)</Label>
            <Input
              id="expense-amount"
              type="number"
              min={1}
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button variant="outline">خروج</Button>
          </CredenzaClose>
          <Button onClick={submit} disabled={!isValid || isPending}>
            {isPending && <Spinner />}
            إضافة
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
