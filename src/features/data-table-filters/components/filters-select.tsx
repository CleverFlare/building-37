"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFiltersContext } from "./filters";
import { Badge } from "@/components/ui/badge";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { filtersMap } from "../constants/filters-map";

export function FilterSelect() {
  const { schema, setNewFilter } = useFiltersContext();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Badge variant="ghost" asChild>
          <button className="text-muted-foreground cursor-pointer hover:text-white">
            <PlusIcon />
            إضافة فلتر
          </button>
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-screen max-w-[200px]">
        {schema.map((item) => {
          const filterMap = filtersMap[item.type as keyof typeof filtersMap];

          return (
            <DropdownMenuItem
              key={item.title}
              onClick={() =>
                setNewFilter({
                  type: item.type,
                  label: item.label,
                  value: null,
                })
              }
            >
              <filterMap.icon weight="fill" /> {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
