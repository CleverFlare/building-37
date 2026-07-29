import { useFieldArray, type Control } from "react-hook-form";
import type { AddApartmentSchema } from "../validation";
import { toArabicOrdinal } from "@/lib/to-arabic-ordinal";
import { KeyIcon, TrashSimpleIcon } from "@phosphor-icons/react/dist/ssr";
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

export default function OwnersTab({
  control,
}: {
  control: Control<AddApartmentSchema>;
}) {
  const ownersList = useFieldArray({
    control: control,
    name: "owner",
  });

  const isEmpty = ownersList.fields.length <= 0;

  function addEmptyItem() {
    ownersList.append({
      name: "",
      phone: "",
      ownershipStartAt: new Date(),
      idPhoto: null,
      ownershipEndAt: null,
    });
  }

  return (
    <div className="bg-muted flex flex-col items-start gap-2 rounded-lg p-4">
      {!isEmpty &&
        ownersList.fields.map((field, index) => (
          <div
            className="bg-background grid w-full grid-cols-1 items-center gap-x-8 gap-y-4 rounded-lg p-4 shadow-xs lg:grid-cols-[auto_1fr]"
            key={field.id}
          >
            <span className="col-span-full flex flex-col gap-4">
              <span className="flex w-full items-center justify-between">
                <h3 className="text-xl font-bold">
                  المالك {toArabicOrdinal(index + 1)}
                </h3>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="hover:bg-destructive/10! hover:text-destructive!"
                  disabled={index === 0}
                  onClick={() => ownersList.remove(index)}
                >
                  <TrashSimpleIcon />
                </Button>
              </span>
              <Separator />
            </span>
            <FormField
              control={control}
              name={`owner.${index}.idPhoto`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>صورة البطاقة</FormLabel>
                  <FormControl>
                    <IdImageField
                      className="w-full max-w-[300px] md:w-screen"
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
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <FormField
                control={control}
                name={`owner.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>إسم المالك</FormLabel>
                    <FormControl>
                      <Input placeholder="إسم المالك..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`owner.${index}.phone`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الهاتف</FormLabel>
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
                control={control}
                name={`owner.${index}.ownershipStartAt`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تاريخ بدأ الملكية</FormLabel>
                    <FormControl>
                      <DatePicker {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField */}
              {/*   control={control} */}
              {/*   name={`owner.${index}.ownershipEndAt`} */}
              {/*   render={({ field: { value, ...field } }) => ( */}
              {/*     <FormItem */}
              {/*       aria-disabled={index !== ownersList.fields.length - 1} */}
              {/*     > */}
              {/*       <FormLabel */}
              {/*         aria-disabled={index !== ownersList.fields.length - 1} */}
              {/*       > */}
              {/*         تاريخ إنتهاء الملكية */}
              {/*       </FormLabel> */}
              {/*       <FormControl> */}
              {/*         <DatePicker */}
              {/*           disabled={index !== ownersList.fields.length - 1} */}
              {/*           value={value ?? undefined} */}
              {/*           {...field} */}
              {/*         /> */}
              {/*       </FormControl> */}
              {/*       <FormMessage /> */}
              {/*     </FormItem> */}
              {/*   )} */}
              {/* /> */}
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
                <KeyIcon />
              </EmptyMedia>
              <EmptyTitle>فارغ</EmptyTitle>
              <EmptyDescription>
                لم يتم إضافة اي مستأجرين حتى الآن.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" onClick={addEmptyItem}>
                إضافة اول مالك <PlusIcon />
              </Button>
            </EmptyContent>
          </Empty>
        </span>
      )}
    </div>
  );
}
