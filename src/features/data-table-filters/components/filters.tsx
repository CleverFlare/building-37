"use client";
import {
  createContext,
  useContext,
  useState,
  type ComponentProps,
  type Dispatch,
  type SetStateAction,
} from "react";
import { type FilterSchema, type StoredFilterSchema } from "../schema/global";
import useFilterQueryState from "../hooks/use-filters-query-state";

const filtersContext = createContext<{
  schema: FilterSchema[];
  storedFilters: StoredFilterSchema[];
  newFilter: StoredFilterSchema | null;
  setNewFilter: Dispatch<SetStateAction<StoredFilterSchema | null>>;
  addFilter: (filter: StoredFilterSchema) => Promise<void>;
  updateFilter: (filter: StoredFilterSchema, index: number) => Promise<void>;
  removeFilter: (index: number) => Promise<void>;
}>({
  schema: [],
  storedFilters: [],
  addFilter: async () => undefined,
  updateFilter: async () => undefined,
  removeFilter: async () => undefined,
  newFilter: null,
  setNewFilter: () => undefined,
});

export const useFiltersContext = () => useContext(filtersContext);

export default function Filters({
  children,
  schema,
}: ComponentProps<"div"> & {
  schema: FilterSchema[];
}) {
  const [storedFilters, storeFilters] = useFilterQueryState();

  const [newFilter, setNewFilter] = useState<StoredFilterSchema | null>(null);

  async function addFilter(filter: StoredFilterSchema) {
    await storeFilters((prev) => [...(prev ?? []), filter], {
      history: "replace",
      shallow: false,
    });
  }

  async function updateFilter(filter: StoredFilterSchema, index: number) {
    await storeFilters(
      (prev) => {
        const values = [...(prev ?? [])];

        values[index] = filter;

        return values;
      },
      { shallow: false, history: "replace" }, // ensures single router update
    );
  }

  async function removeFilter(index: number) {
    await storeFilters(
      (filters) => {
        if (!filters) return [];

        return filters.filter((_, i) => i !== index);
      },
      { shallow: false, history: "replace" }, // ensures single router update
    );
  }

  return (
    <filtersContext.Provider
      value={{
        schema,
        storedFilters: storedFilters,
        addFilter,
        removeFilter,
        newFilter,
        setNewFilter,
        updateFilter,
      }}
    >
      {children}
    </filtersContext.Provider>
  );
}
