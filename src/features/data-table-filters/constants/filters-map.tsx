import { SlidersHorizontalIcon } from "@phosphor-icons/react/dist/ssr";
import NumberRange from "../components/filter-cards/number-range";
import { numberRangeSchema } from "../schema/number-range";

export const filtersMap = {
  numberRange: {
    icon: SlidersHorizontalIcon,
    card: NumberRange,
    schema: numberRangeSchema,
    display: (data: Record<string, unknown> | undefined) =>
      typeof data?.from === "number" && typeof data?.to === "number"
        ? `${data?.from} -> ${data?.to}`
        : "-",
  },
};
