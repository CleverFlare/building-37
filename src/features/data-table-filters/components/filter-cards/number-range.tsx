import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  numberRangeSchema,
  type NumberRangeSchema,
} from "../../schema/number-range";

export default function NumberRange({
  title = "بين رقمين",
  description = "ادخل الرقين الذين تريد الفترة بينهما",
  defaultValues,
  setValue,
  handleRemove,
  close,
  removeOnClose,
}: {
  title: string;
  description: string;
  handleRemove: () => void;
  defaultValues?: NumberRangeSchema;
  setValue: (data: NumberRangeSchema) => void;
  close: () => void;
  removeOnClose?: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NumberRangeSchema>({
    resolver: zodResolver(numberRangeSchema),
    defaultValues,
  });

  function submit(data: NumberRangeSchema) {
    setValue(data);
    close();
    if (removeOnClose) handleRemove();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <Button onClick={handleRemove} variant="destructive" size="sm">
            Remove
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(submit)}
          className="grid grid-cols-2 gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label>من</Label>
            <Input
              placeholder="غير مسموح بكتابة غير الأرقام"
              {...register("from", { valueAsNumber: true })}
            />
            <p className="text-destructive text-xs">{errors.from?.message}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Label>إلى</Label>
            <Input
              placeholder="غير مسموح بكتابة غير الأرقام"
              {...register("to", { valueAsNumber: true })}
            />
            <p className="text-destructive text-xs">{errors.to?.message}</p>
          </div>
          <div className="col-span-full flex gap-2">
            <Button>تنفيذ</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
