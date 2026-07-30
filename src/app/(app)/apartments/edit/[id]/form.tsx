"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { editApartmentSchema, type EditApartmentSchema } from "./validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  SchemaProvider,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { NumberInput } from "@/components/ui/number-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KeyIcon, UserIcon } from "@phosphor-icons/react/dist/ssr";
import OwnersTab from "./_parts/owners-tab";
import RentersTab from "./_parts/renters-tab";
import { Status } from "@prisma/client";
import { deleteFile, replaceFile, uploadFile } from "@/lib/r2";
import { useState } from "react";

export function EditApartmentForm({
  initialValues,
  id,
}: {
  initialValues: EditApartmentSchema;
  id: string;
}) {
  const form = useForm<EditApartmentSchema>({
    resolver: zodResolver(editApartmentSchema),
    defaultValues: initialValues,
  });

  const router = useRouter();

  const [isPending, setIsPending] = useState<boolean>(false);

  const { mutateAsync } = api.apartments.edit.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      router.push("/apartments");
    },
    onSettled: () => {
      setIsPending(false);
    },
  });

  async function submit(data: EditApartmentSchema) {
    setIsPending(true);

    type Owners = (Omit<(typeof data.owner)[number], "idPhoto"> & {
      idPhoto: string | null;
      idPhotoKey: string | null;
    })[];

    type Renters = (Omit<(typeof data.renter)[number], "idPhoto"> & {
      idPhoto: string | null;
      idPhotoKey: string | null;
    })[];

    async function processPeople(
      people: typeof data.owner | typeof data.renter,
      initialData: typeof initialValues.owner | typeof initialValues.renter,
    ) {
      return Promise.all(
        people.map(async (person) => {
          const initialRecord = initialData.find((p) => p.id === person.id);

          // Case 1: Photo removed → delete old file
          if (!person.idPhoto) {
            if (initialRecord?.idPhotoKey) {
              await deleteFile([initialRecord.idPhotoKey]);
            }
            return { ...person, idPhoto: null, idPhotoKey: null };
          }

          // Case 2: New file uploaded
          if (person.idPhoto instanceof File) {
            const file = person.id
              ? await replaceFile(initialRecord?.idPhotoKey!, person.idPhoto)
              : await uploadFile(person.idPhoto);

            return { ...person, idPhoto: file.key, idPhotoKey: file.key };
          }

          // Case 3: Existing string photo, no change
          return person;
        }),
      );
    }

    const [owners, renters] = await Promise.all([
      processPeople(data.owner, initialValues.owner),
      processPeople(data.renter, initialValues.renter),
    ]);

    await mutateAsync({
      id,
      apartmentNumber: data.apartmentNumber,
      status: data.status,
      owner: owners as Owners,
      renter: renters as Renters,
    });
  }

  return (
    <SchemaProvider schema={editApartmentSchema}>
      <Form {...form}>
        <form
          className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3"
          onSubmit={form.handleSubmit(submit)}
        >
          <FormField
            control={form.control}
            name="apartmentNumber"
            render={({ field: { onChange, ...field } }) => (
              <FormItem>
                <FormLabel>رقم الشقة</FormLabel>
                <FormControl>
                  <NumberInput
                    minValue={1}
                    value={field.value}
                    onChange={onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>حالة الشقة</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="مثلاً، هل الشقة مؤجرة؟" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Status?.vacant ?? "vacant"}>
                        فارغة
                      </SelectItem>
                      <SelectItem value={Status?.occupied ?? "occupied"}>
                        مسكونة
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Tabs defaultValue="owners" className="col-span-full">
            <TabsList>
              <TabsTrigger value="owners">
                <KeyIcon />
                الملاك
              </TabsTrigger>
              <TabsTrigger value="renters">
                <UserIcon />
                المستأجرين
              </TabsTrigger>
            </TabsList>

            <TabsContent value="owners">
              <OwnersTab control={form.control} />
            </TabsContent>
            <TabsContent value="renters">
              <RentersTab control={form.control} />
            </TabsContent>
          </Tabs>

          <div className="col-span-full flex items-center gap-2">
            <Button variant="outline" type="button" asChild>
              <Link href="/apartments">عودة</Link>
            </Button>
            <Button disabled={isPending}>
              {isPending && <Loader2 className="animate-spin" />}
              تعديل
            </Button>
          </div>
        </form>
      </Form>
    </SchemaProvider>
  );
}
