export const dynamic = "force-dynamic";

import { AppSidebar } from "@/components/app-sidebar";
import MainContentLayout from "@/components/main-content-layout";
import { ModeToggle } from "@/components/mode-toggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import type { ReactNode } from "react";

export default async function Layout({
  children,
  breadcrumb,
}: {
  children: ReactNode;
  breadcrumb: ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset className="overflow-hidden">
        <MainContentLayout breadcrumb={breadcrumb}>
          {children}
        </MainContentLayout>
      </SidebarInset>
    </SidebarProvider>
  );
}
