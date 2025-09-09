"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { usePathname, useRouter } from "next/navigation";

const otpSchema = z.object({
  otp: z.string().length(6, "الرمز يجب أن يكون مكون من 6 أرقام"),
});
type OtpValues = z.infer<typeof otpSchema>;

export function OtpForm({
  className,
  email,
  ...props
}: React.ComponentProps<"div"> & { email: string }) {
  const form = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const router = useRouter();

  const pathname = usePathname();

  const mutation = api.auth.verifyOtp.useMutation({
    onSuccess: () => {
      toast.success("تم التحقق من الرمز ✅");
      router.push(`${pathname}/${encodeURIComponent(form.watch().otp)}`);
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">أدخل رمز التحقق</CardTitle>
          <CardDescription>
            تفقد بريدك الإلكتروني وأدخل الرمز أدناه
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit((values) =>
              mutation.mutate({ ...values, email }),
            )}
            className="grid gap-6"
          >
            <div className="flex w-full items-center justify-center">
              <InputOTP
                maxLength={6}
                {...form.register("otp")}
                onChange={(val) => form.setValue("otp", val)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            {form.formState.errors.otp && (
              <p className="text-sm text-red-500">
                {form.formState.errors.otp.message}
              </p>
            )}
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "جاري التحقق..." : "تحقق"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
