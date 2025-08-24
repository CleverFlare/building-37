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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { api } from "@/trpc/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function AddApartmentForm() {
  const form = useForm<AddApartmentSchema>({
    resolver: zodResolver(addApartmentSchema),
    defaultValues: {
      rented: false,
      occupied: false,
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

  console.log(form.formState.errors);

  const router = useRouter();

  const { mutateAsync, isPending } = api.apartments.create.useMutation({
    onError: (errors) => {
      console.log(errors);
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
                  <Input
                    type="number"
                    placeholder="ادخل رقم صالحاً..."
                    {...field}
                    onChange={(e) => onChange(e.target.valueAsNumber)}
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
            name="occupant.name"
            disabled={!form.watch("occupied")}
            render={({ field }) => (
              <FormItem>
                <FormLabel isFieldRequired={form.watch("occupied")}>
                  إسم الساكن
                </FormLabel>
                <FormControl>
                  <Input placeholder="الإسم كاملاً..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="occupant.phone"
            disabled={!form.watch("occupied")}
            render={({ field }) => (
              <FormItem>
                <FormLabel>رقم هاتف الساكن</FormLabel>
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
            name="rented"
            render={({ field }) => (
              <FormItem className="col-start-1">
                <FormControl>
                  <Label className="hover:bg-accent/50 flex h-max items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                    <Checkbox
                      id="toggle-2"
                      className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <div className="grid gap-1.5 font-normal">
                      <p className="text-sm leading-none font-medium">
                        شقة مؤجرة؟
                      </p>
                      <p className="text-muted-foreground text-sm">
                        هل قام صاحب الشقة بتأجير هذه الشقة؟
                      </p>
                    </div>
                  </Label>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="occupied"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Label className="hover:bg-accent/50 flex h-max items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                    <Checkbox
                      id="toggle-2"
                      className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <div className="grid gap-1.5 font-normal">
                      <p className="text-sm leading-none font-medium">
                        الشقة مسكونة؟
                      </p>
                      <p className="text-muted-foreground text-sm">
                        هل هناك احد يعيش بالشقة؟
                      </p>
                    </div>
                  </Label>
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
