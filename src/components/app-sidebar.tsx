"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { navigation } from "@/config/navigation";
import Link from "next/link";
import { NavUser } from "./nav-user";
import { usePathname } from "next/navigation";
import { z } from "zod/v4";
import { ar } from "zod/v4/locales";
import { MoneyIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

z.config(ar());

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar side="right">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2 pt-2">
            <span className="bg-primary border-primary flex size-8 items-center justify-center rounded-lg border-2 text-white inset-shadow-sm inset-shadow-white/50">
              <MoneyIcon className="!size-5" />
            </span>
            <span className={cn("font-bold")}>مصاريفنا</span>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {navigation.groups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.links.map((item) => {
                  const isActive =
                    item.activeOn === undefined
                      ? item.href === pathname
                      : item.activeOn?.some((activeOn) =>
                          typeof activeOn === "string"
                            ? pathname === activeOn
                            : new RegExp(activeOn).test(pathname),
                        );

                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.href}>
                          <item.icon weight={isActive ? "fill" : "regular"} />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{ name: "Muhammad Maher", username: "@admin", avatar: "" }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
