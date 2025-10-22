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
import { cn } from "@/lib/utils";
import Logo from "./logo";
import { useAuth } from "@/stores/auth";
import type { ComponentProps } from "react";

z.config(ar());

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const user = useAuth((state) => state.user);
  const pathname = usePathname();

  return (
    <Sidebar side="right" collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2 pt-2">
            <Logo />
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
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className="data-[slot=sidebar-menu-button]:!p-1.5"
                      >
                        <Link href={item.href}>
                          <item.icon
                            weight="duotone"
                            className={cn(isActive ? "text-primary" : "")}
                          />
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
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
