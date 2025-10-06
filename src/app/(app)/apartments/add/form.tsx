"use client";
import { PhoneInput } from "@/components/phone-input";
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
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
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
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import { NumberInput } from "@/components/ui/number-input";

export function AddApartmentForm() {
  const form = useForm<AddApartmentSchema>({
    resolver: zodResolver(addApartmentSchema),
    defaultValues: {
      state: "vacant",
      owner: {
        name: "",
        phone: "",
      },
      occupant: {
        name: "",
        phone: "",
      },
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
    await mutateAsync(data);
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
            name="owner.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>إسم المالك</FormLabel>
                <FormControl>
                  <Input placeholder="الإسم كاملاً..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="owner.phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رقم هاتف المالك</FormLabel>
                <FormControl>
                  <PhoneInput
                    countrySelectProps={{ disabled: true }}
                    defaultCountry="EG"
                    placeholder="ادخل رقم هاتف صالح..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>حالة الشقة</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="مثلاً، هل الشقة مؤجرة؟" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vacant">فارغة</SelectItem>
                      <SelectItem value="occupied">
                        مسكونة (من المالك)
                      </SelectItem>
                      <SelectItem value="rented">مؤجرة</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="occupant.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel isFieldRequired={form.watch("state") === "rented"}>
                  إسم الساكن
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="الإسم كاملاً..."
                    disabled={form.watch("state") !== "rented"}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="occupant.phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رقم هاتف الساكن</FormLabel>
                <FormControl>
                  <PhoneInput
                    countrySelectProps={{ disabled: true }}
                    defaultCountry="EG"
                    placeholder="ادخل رقم هاتف صالح..."
                    disabled={form.watch("state") !== "rented"}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
