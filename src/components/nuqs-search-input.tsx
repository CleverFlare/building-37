"use client";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";
import { Input } from "./ui/input";
import { useQueryState } from "nuqs";
import { useState, type FormEvent } from "react";
import { XIcon } from "lucide-react";

export default function NuqsSearchInput({
  placeholder,
}: {
  placeholder?: string;
}) {
  const [search, setSearch] = useQueryState("name");
  const [value, setValue] = useState(search);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    await setSearch(value);
  }

  async function handleClearSearch() {
    await setSearch(null);
    setValue("");
  }

  return (
    <form
      className="relative flex w-full max-w-[300px] items-center"
      onSubmit={handleSubmit}
    >
      <Input
        placeholder={placeholder ?? "بحث..."}
        style={{
          paddingInlineStart: "30px",
          paddingInlineEnd: search ? "35px" : "unset",
        }}
        value={value ?? ""}
        onChange={(e) => setValue(e.target.value)}
      />
      <MagnifyingGlassIcon
        className="pointer-events-none absolute"
        style={{ insetInlineStart: "10px" }}
      />

      {search && (
        <button
          className="absolute flex aspect-square h-full items-center justify-center"
          style={{ insetInlineEnd: "0" }}
          type="button"
          onClick={handleClearSearch}
        >
          <XIcon size={15} />
        </button>
      )}
    </form>
  );
}
