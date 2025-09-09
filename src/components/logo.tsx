import { MoneyIcon } from "@phosphor-icons/react/dist/ssr";

export default function Logo() {
  return (
    <span className="bg-primary border-primary flex size-8 items-center justify-center rounded-lg border-2 text-white inset-shadow-sm inset-shadow-white/50">
      <MoneyIcon className="!size-5" />
    </span>
  );
}
