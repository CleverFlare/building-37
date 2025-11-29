"use client";
import { z } from "zod/v4";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const formSchema = z
  .object({
    currentPassword: z
      .string("مطلوب")
      .min(8, "يجب ان تكون كلمة المرور مكونة من 8 احرف على الأقل"),
    newPassword: z
      .string("مطلوب")
      .min(8, "يجب ان تكون كلمة المرور مكونة من 8 احرف على الأقل"),
    confirmNewPassword: z
      .string("مطلوب")
      .min(8, "يجب ان تكون كلمة المرور مكونة من 8 احرف على الأقل"),
  })
  .check((param) => {
    if (param.value.newPassword !== param.value.confirmNewPassword)
      param.issues.push({
        code: "custom",
        path: ["confirmNewPassword"],
        message: "كلمة المرور غير مطابقة",
        input: "input",
      });
  });

export default function ChangePasswordForm() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const { isPending, mutateAsync } = api.auth.changePassword.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("تم تغيير كلمة المرور بنجاح");
    },
    onSettled: () => {
      reset();
    },
  });

  async function submit(data: z.infer<typeof formSchema>) {
    await mutateAsync(data);
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-8 py-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <span className="flex flex-col gap-2">
          <h2>كلمة المرور الحالية</h2>
          <p className="text-muted-foreground">
            كلمة المرور التي تستخدمها حاليًا لتسجيل الدخول
          </p>
        </span>
        <div className="flex w-full flex-col justify-between gap-4">
          <Input
            type="password"
            placeholder="••••••••"
            {...register("currentPassword")}
          />
          <p className="text-destructive text-xs">
            {errors.currentPassword?.message}
          </p>
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <span className="flex flex-col gap-2">
          <h2>كلمة المرور الجديدة</h2>
          <p className="text-muted-foreground">
            كلمة المرور التي ستُبدل كلمة المرور الحالية
          </p>
        </span>
        <div className="flex w-full flex-col justify-between gap-4">
          <Input
            type="password"
            placeholder="••••••••"
            {...register("newPassword")}
          />
          <p className="text-destructive text-xs">
            {errors.newPassword?.message}
          </p>
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <span className="flex flex-col gap-2">
          <h2>تأكيد كلمة المرور الجديدة</h2>
          <p className="text-muted-foreground">
            تأكيد لكلمة المرور الجديدة لمنع حدوث اخطاء مطبعية غير مقصودة
          </p>
        </span>
        <div className="flex w-full flex-col justify-between gap-4">
          <Input
            type="password"
            placeholder="••••••••"
            {...register("confirmNewPassword")}
          />
          <p className="text-destructive text-xs">
            {errors.confirmNewPassword?.message}
          </p>
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
  );
}
