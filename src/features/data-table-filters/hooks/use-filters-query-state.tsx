import { parseAsArrayOf, parseAsJson, useQueryState } from "nuqs";
import { storedFilterSchema } from "../schema/global";

export default function useFilterQueryState() {
  return useQueryState(
    "filters",
    parseAsArrayOf(
      parseAsJson(storedFilterSchema.parse.bind(parseAsJson)),
    ).withDefault([]),
  );
}
