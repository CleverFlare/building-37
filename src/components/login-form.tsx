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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod/v4";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ---------------- Schema ----------------
const loginSchema = z.object({
  username: z.string().min(3, "إسم المستخدم يجب أن يكون 3 أحرف على الأقل"),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ---------------- Component ----------------
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const router = useRouter();

  const loginMutation = api.auth.login.useMutation({
    onSuccess: (data) => {
      toast.success("تم تسجيل الدخول بنجاح");
      // example: save token to localStorage or cookies
      // localStorage.setItem("token", data.token);
      router.push("/");
      form.reset();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  function onSubmit(values: LoginFormValues) {
    loginMutation.mutate(values);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">اهلاً بعودتك</CardTitle>
          <CardDescription>
            قم بتسجيل الدخول عن طريق إسم المستخدم وكلمة المرور
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="username">إسم المستخدم</Label>
              <Input
                id="username"
                placeholder="@username"
                {...form.register("username")}
                dir="ltr"
                className="text-right"
              />
              {form.formState.errors.username && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.username.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="password">كلمة المرور</Label>
                <Link
                  href="/forgot-password"
                  className="ms-auto text-sm underline-offset-4 hover:underline"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                {...form.register("password")}
                dir="ltr"
                className="text-right"
              />
              {form.formState.errors.password && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "جاري التسجيل..." : "تسجيل"}
            </Button>
            <div className="text-center text-sm">
              لا تملك حساباً بالفعل؟{" "}
              <a href="/register" className="underline underline-offset-4">
                أنشئ حساب
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
