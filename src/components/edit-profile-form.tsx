"use client";

import { z } from "zod/v4";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/stores/auth";
import { useController, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { api } from "@/trpc/react";
import { Loader2 } from "lucide-react";
import { deleteFile, uploadFile } from "@/lib/r2";
import { toast } from "sonner";

const formSchema = z.object({
  avatar: z.object({
    file: z.file().nullable(),
    url: z.string().nullable(),
  }),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  email: z.email(),
});

export default function EditProfileForm() {
  const { user, setUser } = useAuth();

  const { control, register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      email: user?.email,
      lastName: user?.lastName,
      firstName: user?.firstName,
      username: user?.username,
      avatar: {
        url: user?.avatarUrl,
      },
    },
    resolver: zodResolver(formSchema),
  });

  // Whenever `user` is loaded/updated, sync it into the form
  useEffect(() => {
    if (!user) return;

    reset({
      email: user.email ?? "",
      lastName: user.lastName ?? "",
      firstName: user.firstName ?? "",
      username: user.username ?? "",
      avatar: {
        file: null,
        url: user.avatarUrl ?? null,
      },
    });
  }, [user, reset]);

  const { field } = useController({ control, name: "avatar" });
  const avatarRef = useRef<HTMLInputElement>(null);

  const [isPending, setIsPending] = useState<boolean>(false);

  const { mutateAsync } = api.users.updateProfile.useMutation({
    onSuccess: (data) => {
      setUser(data);
      toast.success("تم تعديل الملف الشخصي");
    },
    onError: (err) => {
      toast.error(err.message);
    },
    onSettled: () => setIsPending(false),
  });

  async function submit(data: z.infer<typeof formSchema>) {
    setIsPending(true);

    let avatar = null;

    if (data.avatar.file) avatar = await uploadFile(data.avatar.file);
    else if (user?.avatarKey) await deleteFile([user.avatarKey]);

    await mutateAsync({
      ...(avatar?.url && avatar.key
        ? { avatar: { url: avatar?.url, key: avatar?.key } }
        : { avatar: null }),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      username: data.username,
    });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-8 py-8">
      <div className="mx-auto grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <span className="flex flex-col gap-2">
          <h2>الصورة الشخصية</h2>
          <p className="text-muted-foreground">
            يمكنك ازالة او تغيير الصورة الشخصية الخاصة بك
          </p>
        </span>
        <div className="flex w-full justify-between gap-2">
          <Avatar className="size-[80px] rounded-2xl">
            <AvatarImage src={field.value.url ?? undefined} />
            <AvatarFallback className="rounded-2xl">
              {
                // eslint-disable-next-line
                watch().firstName?.[0] ?? "M"
              }{" "}
              {watch().lastName?.[0] ?? "T"}
            </AvatarFallback>
          </Avatar>
          <div className="flex gap-2">
            <input
              type="file"
              className="sr-only"
              ref={avatarRef}
              onChange={(e) => {
                if (!e.target.files?.[0]) return;

                field.onChange({
                  file: e.target.files[0] ?? null,
                  url: URL.createObjectURL(e.target.files[0]),
                });
              }}
            />
            <Button
              type="button"
              variant="ghost"
              className="text-destructive hover:text-destructive hover:bg-destructive-foreground font-semibold"
              onClick={() => field.onChange({ file: null, url: null })}
            >
              إزالة
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="text-primary hover:text-primary hover:bg-primary-foreground font-semibold"
              onClick={() => avatarRef.current?.click()}
            >
              تغيير
            </Button>
          </div>
        </div>
      </div>
      <Separator />
      <div className="mx-auto grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <span className="flex flex-col gap-2">
          <h2>الإسم</h2>
        </span>
        <div className="flex w-full flex-col justify-between gap-4 sm:flex-row">
          <Input placeholder="الإسم الأول..." {...register("firstName")} />
          <Input placeholder="الإسم الأخير..." {...register("lastName")} />
        </div>
      </div>
      <Separator />
      <div className="mx-auto grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <span className="flex flex-col gap-2">
          <h2>إسم المستخدم</h2>
        </span>
        <div className="flex w-full justify-between gap-2">
          <Input dir="ltr" {...register("username")} />
        </div>
      </div>
      <Separator />
      <div className="mx-auto grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <span className="flex flex-col gap-2">
          <h2>البريد الإلكتروني</h2>
        </span>
        <div className="flex w-full justify-between gap-2">
          <Input dir="ltr" {...register("email")} />
        </div>
      </div>
      <Separator />
      <div className="flex items-center gap-2">
        <Button disabled={isPending}>
          {isPending && <Loader2 className="animate-spin" />}
          حفظ
        </Button>
      </div>
    </form>
  );
}
