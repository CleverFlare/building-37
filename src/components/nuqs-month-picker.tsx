import React, { useMemo } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // shadcn popover
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useQueryState, parseAsInteger } from "nuqs";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Separator } from "./ui/separator";

// Props
export type MonthYearPickerProps = {
  /** query param keys to sync with URL using nuqs */
  yearKey?: string;
  monthKey?: string;
  /** fallback initial value */
  defaultValue?: Date | null;
  /** min and max year range */
  minYear?: number;
  maxYear?: number;
  /** callback when value changes */
  onChange?: (value: Date | null) => void;
};

export default function MonthYearPicker({
  yearKey = "year",
  monthKey = "month",
  defaultValue = null,
  minYear,
  maxYear,
  onChange,
}: MonthYearPickerProps) {
  // year/month state synced to URL with nuqs. parseAsInteger ensures numbers in URL become numbers here.
  const [year, setYear] = useQueryState(
    yearKey,
    parseAsInteger.withDefault(new Date().getFullYear()),
  );
  const [month, setMonth] = useQueryState(
    monthKey,
    parseAsInteger.withDefault(new Date().getMonth()),
  );

  const now = new Date();
  const currentYear = now.getFullYear();
  const lower = minYear ?? currentYear - 10;
  const upper = maxYear ?? currentYear + 5;

  // derive a Date object from year/month or defaultValue
  const selectedDate = useMemo(() => {
    if (typeof year === "number" && typeof month === "number") {
      return new Date(year, month, 1);
    }
    if (defaultValue) return defaultValue;
    return null;
  }, [year, month, defaultValue]);

  // generate month labels in Arabic using date-fns
  const months = useMemo(() => {
    const y = selectedDate ? selectedDate.getFullYear() : currentYear;
    return Array.from({ length: 12 }).map((_, m) => ({
      value: m,
      label: format(new Date(y, m, 1), "LLLL", { locale: ar }),
    }));
  }, [selectedDate, currentYear]);

  // generate years range
  const years = useMemo(() => {
    const arr: number[] = [];
    for (let y = upper; y >= lower; y--) arr.push(y);
    return arr;
  }, [lower, upper]);

  // when internal state changes, call onChange
  React.useEffect(() => {
    if (onChange) {
      onChange(selectedDate);
    }
  }, [selectedDate, onChange]);

  const isToday =
    selectedDate?.getMonth() === new Date().getMonth() &&
    selectedDate?.getFullYear() === new Date().getFullYear();

  const displayLabel = selectedDate
    ? format(selectedDate, "LLLL yyyy", { locale: ar })
    : "اختر الشهر والسنة";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full max-w-[300px] justify-start"
        >
          <CalendarIcon />
          {isToday ? "الشهر والسنة الحالية" : displayLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[520px]" align="start">
        <div className="flex justify-between gap-2">
          <Button variant="ghost" onClick={() => setYear((prev) => --prev)}>
            <ChevronRightIcon />
          </Button>
          <Select
            value={typeof year === "number" ? String(year) : undefined}
            onValueChange={(v) => setYear(Number(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="السنة" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="ghost" onClick={() => setYear((prev) => ++prev)}>
            <ChevronLeftIcon />
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {months.map((m) => (
            <Button
              variant={month === m.value ? "outline" : "ghost"}
              key={m.value}
              onClick={() => setMonth(m.value)}
            >
              {m.label}
            </Button>
          ))}
        </div>

        <div className="mt-3 flex flex-col justify-end gap-2">
          <Separator />
          <Button
            variant="outline"
            onClick={async () => {
              await setYear(new Date().getFullYear());
              await setMonth(new Date().getMonth());
            }}
          >
            الشهر والسنة الحالية
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/*
Usage notes:
- Install dependencies: `npm install nuqs date-fns @types/date-fns` and shadcn/ui components from your app.
- This component uses shadcn's Popover, Button and Select components. Adjust import paths to your project.
- The component syncs `year` and `month` to the URL using nuqs. You can pass custom `yearKey`/`monthKey` or `onChange` to get the selected Date.
- All labels and placeholders are in Arabic. Month names are localized using date-fns `ar` locale.
*/
