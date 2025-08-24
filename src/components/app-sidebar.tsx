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
import { IconInnerShadowTop } from "@tabler/icons-react";
import { navigation } from "@/config/navigation";
import Link from "next/link";
import { NavUser } from "./nav-user";
import { usePathname } from "next/navigation";
import { z } from "zod/v4";
import { ar } from "zod/v4/locales";

z.config(ar());

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar side="right">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2 pt-2">
            <IconInnerShadowTop className="!size-5" />
            <span className="text-base font-semibold">Acme Inc</span>
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
