"use client";
import { z } from "zod/v4";
import { Separator } from "./ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Form, FormField, FormItem, FormMessage } from "./ui/form";
import { NumberInput } from "./ui/number-input";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  monthlyFee: z.number("مطلوب").min(1, "يجب ان تكون على الأقل 1"),
});

export default function SystemSettingsForm({
  monthlyFee,
}: z.infer<typeof formSchema>) {
  const router = useRouter();
  const form = useForm({
    defaultValues: { monthlyFee },
    resolver: zodResolver(formSchema),
  });

  const { isPending, mutateAsync } = api.system.settings.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("تم تغيير إعدادات النظام");
    },
    onSettled: () => {
      router.refresh();
    },
  });

  async function submit(data: z.infer<typeof formSchema>) {
    await mutateAsync(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submit)}
        className="flex flex-col gap-8 py-8"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <span className="flex flex-col gap-2">
            <h2>المصروف الشهري</h2>
            <p className="text-muted-foreground">
              المبلغ المطلوب من كل شقة كل شهر
            </p>
          </span>
          <div className="flex w-full flex-col justify-between gap-4">
            <FormField
              control={form.control}
              name="monthlyFee"
              render={({ field }) => (
                <FormItem>
                  <NumberInput
                    formatOptions={{
                      style: "currency",
                      currency: "EGP",
                      currencyDisplay: "code",
                      currencySign: "accounting",
                    }}
                    value={field.value}
                    onChange={field.onChange}
                    minValue={1}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Separator />
        <div className="flex items-center gap-2">
          <Button disabled={isPending}>
            {isPending && <Loader2 className="animate-spin" />}
            تغيير
          </Button>
        </div>
      </form>
    </Form>
  );
}
