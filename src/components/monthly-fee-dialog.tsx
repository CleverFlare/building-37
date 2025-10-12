import { GearIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "./ui/button";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "./ui/credenza";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { NumberInput } from "./ui/number-input";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { api } from "@/trpc/react";
import { Spinner } from "./ui/spinner";

const schema = z.object({
  monthlyFee: z.int(),
});

export default function MonthlyFeeDialog({ value }: { value: number }) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { monthlyFee: value },
  });

  const { mutateAsync, isPending } =
    api.monthlyFees.setMonthlyFee.useMutation();

  async function submit(data: z.infer<typeof schema>) {
    await mutateAsync(data);
  }

  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button size="icon">
          <GearIcon />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle className="text-start">
            مصروف العمارة الشهري
          </CredenzaTitle>
          <CredenzaDescription className="text-start">
            قم بتعيين مصروف العمارة الشهري
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)}>
              <FormField
                control={form.control}
                name="monthlyFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="monthly-fee">المصروف الشهري</FormLabel>
                    <NumberInput
                      id="monthly-fee"
                      formatOptions={{
                        style: "currency",
                        currency: "EGP",
                        currencyDisplay: "code",
                        currencySign: "accounting",
                      }}
                      value={field.value}
                      onChange={field.onChange}
                      minValue={1}
                    />
                    <FormMessage>
                      {form?.formState?.errors?.monthlyFee?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CredenzaBody>
        <CredenzaFooter>
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            القيمة الإفتراضية
          </Button>
          <Button
            onClick={() => form.handleSubmit(submit)()}
            disabled={isPending}
          >
            {isPending && <Spinner />}
            تعديل القيمة
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
