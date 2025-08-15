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
import { navigation } from "@/constants/navigation";
import Image from "next/image";
import Link from "next/link";
import { NavUser } from "./nav-user";
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar side="right">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg p-2 hover:bg-neutral-200 hover:dark:bg-neutral-800"
            >
              <span className="flex size-[40px] items-center justify-center rounded-2xl bg-blue-700 font-bold dark:bg-blue-200">
                <Image
                  src="/property.png"
                  width={40}
                  height={40}
                  alt="Logo"
                  className="size-[25px]"
                />
              </span>
              <p className="text-lg font-bold">عمارة 37</p>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>الأقسام</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.navlinks.map((item) => {
                const isActive =
                  item.activeOn === undefined
                    ? item.href === pathname
                    : item.activeOn?.some((activeOn) =>
                        typeof activeOn === "string"
                          ? pathname === activeOn
                          : activeOn.test(pathname),
                      );

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{ name: "Muhammad Maher", username: "@admin", avatar: "" }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
