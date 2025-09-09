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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { api } from "@/trpc/react"; // T3 stack tRPC hook client
import { useRouter } from "next/navigation";

// ---------------- Schema ----------------
const registerSchema = z.object({
  firstName: z.string().min(1, "الإسم الأول مطلوب"),
  lastName: z.string().min(1, "الإسم الأخير مطلوب"),
  username: z.string().min(3, "إسم المستخدم يجب أن يكون 3 أحرف على الأقل"),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

// ---------------- Component ----------------
export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      email: "",
    },
  });

  const router = useRouter();

  const registerMutation = api.auth.register.useMutation({
    onSuccess: () => {
      toast.success("تم إنشاء الحساب بنجاح 🎉");
      router.push("/");
      form.reset();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  function onSubmit(values: RegisterFormValues) {
    registerMutation.mutate(values);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">إنشاء حساب جديد</CardTitle>
          <CardDescription>
            قم بملء البيانات التالية لإنشاء حسابك
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="firstName">الإسم الأول</Label>
              <Input
                id="firstName"
                placeholder="محمود"
                {...form.register("firstName")}
                dir="ltr"
                className="text-right"
              />
              {form.formState.errors.firstName && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.firstName.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="lastName">الإسم الأخير</Label>
              <Input
                id="lastName"
                placeholder="إسماعيل"
                {...form.register("lastName")}
                dir="ltr"
                className="text-right"
              />
              {form.formState.errors.lastName && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.lastName.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                {...form.register("email")}
                dir="ltr"
                className="text-right"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
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
              <Label htmlFor="password">كلمة المرور</Label>
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
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending
                ? "جاري إنشاء الحساب..."
                : "تسجيل حساب"}
            </Button>
            <div className="text-center text-sm">
              لديك حساب بالفعل؟{" "}
              <a href="/login" className="underline underline-offset-4">
                سجل الدخول
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
