import { useFieldArray, type Control } from "react-hook-form";
import type { EditApartmentSchema } from "../validation";
import { toArabicOrdinal } from "@/lib/to-arabic-ordinal";
import { TrashSimpleIcon, UserIcon } from "@phosphor-icons/react/dist/ssr";
import { Separator } from "@/components/ui/separator";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import IdImageField from "@/components/id-image-field";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/phone-input";
import { DatePicker } from "@/components/date-picker-field";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function RentersTab({
  control,
}: {
  control: Control<EditApartmentSchema>;
}) {
  const rentersList = useFieldArray({
    control: control,
    name: "renter",
  });

  const isEmpty = rentersList.fields.length <= 0;

  function addEmptyItem() {
    rentersList.append({
      name: "",
      phone: "",
      rentStartAt: new Date(),
      rentEndAt: null,
      idPhoto: null,
      idPhotoKey: null,
    });
  }

  return (
    <div className="bg-muted flex flex-col items-start gap-2 rounded-lg p-4">
      {!isEmpty &&
        rentersList.fields.map((field, index) => (
          <div
            className="grid w-full grid-cols-1 items-center gap-x-8 gap-y-4 rounded-lg bg-white p-4 shadow-xs md:grid-cols-[auto_1fr]"
            key={field.id}
          >
            <span className="col-span-full flex flex-col gap-4">
              <span className="flex w-full items-center justify-between">
                <h3 className="text-xl font-bold">
                  المستأجر {toArabicOrdinal(index + 1)}
                </h3>
                <button
                  className="text-muted-foreground flex size-8 items-center justify-center rounded-md hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => rentersList.remove(index)}
                >
                  <TrashSimpleIcon />
                </button>
              </span>
              <Separator />
            </span>
            <FormField
              control={control}
              name={`renter.${index}.idPhoto`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>صورة البطاقة</FormLabel>
                  <FormControl>
                    <IdImageField
                      className="w-[300px]"
                      value={field.value ?? undefined}
                      onChange={(file) => field.onChange(file)}
                      onRemove={() => field.onChange(undefined)}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name={`renter.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>إسم المستأجر</FormLabel>
                    <FormControl>
                      <Input placeholder="إسم المالك..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`renter.${index}.phone`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الهاتف</FormLabel>
                    <FormControl>
                      <PhoneInput
                        countrySelectProps={{ disabled: true }}
                        defaultCountry="EG"
                        placeholder="ادخل رقم هاتف صالح..."
                        {...field}
                        value={field.value ?? undefined}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`renter.${index}.rentStartAt`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تاريخ بدأ الإيجار</FormLabel>
                    <FormControl>
                      <DatePicker {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`renter.${index}.rentEndAt`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تاريخ إنتهاء الإيجار</FormLabel>
                    <FormControl>
                      <DatePicker {...field} value={field.value ?? undefined} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}

      {!isEmpty && (
        <Button variant="ghost" type="button" onClick={addEmptyItem}>
          إضافة <PlusIcon />
        </Button>
      )}

      {isEmpty && (
        <span className="border-border w-full rounded-lg border border-dashed p-2">
          <Empty>
            <EmptyHeader>
              <EmptyMedia className="bg-white shadow-xs" variant="icon">
                <UserIcon />
              </EmptyMedia>
              <EmptyTitle>فارغ</EmptyTitle>
              <EmptyDescription>
                لم يتم إضافة اي مستأجرين حتى الآن.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" onClick={addEmptyItem}>
                إضافة اول مستأجر <PlusIcon />
              </Button>
            </EmptyContent>
          </Empty>
        </span>
      )}
    </div>
  );
}
