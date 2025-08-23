import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import type { ReactNode } from "react";

export default function Layout({
  children,
  breadcrumb,
}: {
  children: ReactNode;
  breadcrumb: ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="grid w-full grid-cols-1 grid-rows-[auto_1fr]">
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
        <article className="p-4">{children}</article>
      </main>
    </SidebarProvider>
  );
}
