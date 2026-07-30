"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type AddApartmentSchema, addApartmentSchema } from "./validation";
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
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NumberInput } from "@/components/ui/number-input";
import { Status } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KeyIcon, UserIcon } from "@phosphor-icons/react/dist/ssr";
import OwnersTab from "./_parts/owners-tab";
import RentersTab from "./_parts/renters-tab";
import { uploadFile } from "@/lib/r2";

export function AddApartmentForm() {
  const form = useForm<AddApartmentSchema>({
    resolver: zodResolver(addApartmentSchema),
    defaultValues: {
      owner: [
        {
          name: "",
          phone: "",
          ownershipStartAt: new Date(),
          ownershipEndAt: null,
          idPhoto: null,
        },
      ],
      renter: [],
      status: "vacant",
      apartmentNumber: 1,
    },
  });

  const router = useRouter();

  const { mutateAsync, isPending } = api.apartments.create.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      router.push("/apartments");
    },
  });

  async function submit(data: AddApartmentSchema) {
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
    ) {
      return Promise.all(
        people.map(async (person) => {
          if (!person.idPhoto) {
            return { ...person, idPhoto: null, idPhotoKey: null };
          }

          const file = await uploadFile(person.idPhoto);

          return {
            ...person,
            idPhoto: file.key,
            idPhotoKey: file.key,
          };
        }),
      );
    }

    const [owners, renters] = await Promise.all([
      processPeople(data.owner),
      processPeople(data.renter),
    ]);

    await mutateAsync({
      apartmentNumber: data.apartmentNumber,
      status: data.status,
      owner: owners as Owners,
      renter: renters as Renters,
    });
  }

  return (
    <SchemaProvider schema={addApartmentSchema}>
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
              إضافة
            </Button>
          </div>
        </form>
      </Form>
    </SchemaProvider>
  );
}
