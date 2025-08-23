"use client";

import type { SchemaTypes } from "../schema/global";
import { FilterChip } from "./filter-chip";
import { useFiltersContext } from "./filters";

export function FiltersList() {
  const {
    storedFilters,
    addFilter,
    updateFilter,
    removeFilter,
    setNewFilter,
    newFilter,
  } = useFiltersContext();

  return (
    <>
      {storedFilters.map((filter, index) => (
        <FilterChip
          key={filter.label + index}
          data={filter.value as SchemaTypes}
          filter={filter}
          setValue={(value) => updateFilter(value, index)}
          remove={() => removeFilter(index)}
        />
      ))}
      {newFilter && (
        <FilterChip
          remove={() => setNewFilter(null)}
          setValue={addFilter}
          isCreate
          filter={newFilter}
        />
      )}
    </>
  );
}
