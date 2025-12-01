import type { ReactNode } from "react";
import { ModeToggle } from "./mode-toggle";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";

export default function MainContentLayout({
  children,
  breadcrumb,
}: {
  children: ReactNode;
  breadcrumb: ReactNode;
}) {
  return (
    <main className="bg-background grid flex-1 grid-cols-1 grid-rows-[auto_1fr]">
      <nav className="flex w-full items-center p-4">
        <SidebarTrigger />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex-1">{breadcrumb}</div>
        <div className="flex gap-2">
          <ModeToggle />
        </div>
      </nav>
      <article className="p-4">
        <ScrollArea>{children}</ScrollArea>
      </article>
    </main>
  );
}
