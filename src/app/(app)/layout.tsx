import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="grid w-full grid-cols-1 grid-rows-[auto_1fr]">
        <nav className="flex w-full items-center border-b p-4">
          <SidebarTrigger />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h2 className="flex-1 text-xl font-bold">الشقق</h2>
          <div className="flex gap-2">
            <ModeToggle />
          </div>
        </nav>
        <article className="p-4">{children}</article>
      </main>
    </SidebarProvider>
  );
}
