"use client";
import { useState } from "react";
import { filtersMap } from "../constants/filters-map";
import type {
  FilterSchema,
  SchemaTypes,
  StoredFilterSchema,
} from "../schema/global";
import { useFiltersContext } from "./filters";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function FilterChip<T extends StoredFilterSchema | FilterSchema>({
  filter,
  isCreate = false,
  data,
  remove,
  setValue,
}: {
  filter: T;
  isCreate?: boolean;
  data?: SchemaTypes | undefined;
  remove: () => void;
  setValue: (data: StoredFilterSchema) => void;
}) {
  const { schema } = useFiltersContext();
  const filterFromSchema = schema.find(
    (schemaFilter) => schemaFilter.type === filter.type,
  );

  const filterMap = filtersMap[filter.type as keyof typeof filtersMap];

  const [open, setOpen] = useState<boolean>(false);

  return (
    <Popover
      open={isCreate ? true : open}
      onOpenChange={(value) => setOpen(value)}
    >
      <PopoverTrigger asChild>
        <Badge asChild>
          <button>
            <filterMap.icon weight="fill" />
            {filterMap.display(data)}
            <ChevronDown />
          </button>
        </Badge>
      </PopoverTrigger>
      <PopoverContent
        className="w-max border-none bg-transparent p-0"
        align="start"
      >
        <filterMap.card
          title={filterFromSchema?.title ?? "غير معروف"}
          description={filterFromSchema?.description ?? "غير معروف"}
          defaultValues={data}
          handleRemove={remove}
          close={() => setOpen(false)}
          removeOnClose={isCreate}
          setValue={(data) =>
            setValue({
              value: data,
              type: filter.type,
              label: filter.label,
            })
          }
        />
      </PopoverContent>
    </Popover>
  );
}
