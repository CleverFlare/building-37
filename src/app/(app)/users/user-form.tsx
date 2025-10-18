import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  SchemaProvider,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { userSchema, type UserSchema } from "./validations";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function UserForm({
  defaultValues,
  id = null,
  children,
  open,
  onOpenChange,
}: {
  defaultValues?: Omit<UserSchema, "password">;
  id?: string | null;
  children?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const form = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: "user",
      email: "",
      firstName: "",
      lastName: "",
      username: "",
      // eslint-disable-next-line
      ...(defaultValues ? defaultValues : {}),
    },
  });

  const router = useRouter();

  const { mutateAsync, isPending } = api.users[
    id ? "update" : "create"
  ].useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      router.push("/users");
    },
  });

  async function submit(data: UserSchema) {
    if (id) await mutateAsync({ password: "", ...data, id });
    else await mutateAsync({ password: "", ...data, id: id! });
  }

  return (
    <Credenza open={open} onOpenChange={onOpenChange}>
      {children && <CredenzaTrigger asChild>{children}</CredenzaTrigger>}
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>
            {id ? "تعديل بيانات مستخدم" : "إضافة مستخدم"}
          </CredenzaTitle>
          <CredenzaDescription>
            قم {id ? "بتعديل بيانات المستخدم" : "إضافة مستخدم جديد"} من خلال
            الحقول التالية
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <SchemaProvider schema={userSchema}>
            <Form {...form}>
              <form
                className="grid grid-cols-1 gap-4"
                onSubmit={form.handleSubmit(submit)}
              >
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الإسم الأول</FormLabel>
                      <FormControl>
                        <Input placeholder="الإسم الأول..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الإسم الأخير</FormLabel>
                      <FormControl>
                        <Input placeholder="الإسلم الأخير..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>البريد الإلكتروني</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="البريد الإلكتروني..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>إسم المستخدم</FormLabel>
                      <FormControl>
                        <Input placeholder="إسم المستخدم..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>كلمة المرور</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="كلمة المرور..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الوظيفة</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="الوظيفة..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="moderator">مدير</SelectItem>
                            <SelectItem value="user">مستخدم</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </SchemaProvider>
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button variant="outline">إلغاء</Button>
          </CredenzaClose>
          <Button
            onClick={() => form.handleSubmit(submit)()}
            disabled={isPending}
          >
            {isPending && <Spinner />}
            {id ? "تعديل" : "إضافة"}
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
