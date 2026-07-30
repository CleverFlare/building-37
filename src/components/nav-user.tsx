"use client";

import { ChevronsUpDown, Loader2, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { UserCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function NavUser({
  user,
}: {
  user: {
    firstName: string;
    lastName: string;
    username: string;
    avatarKey?: string | null;
  } | null;
}) {
  const { isMobile } = useSidebar();

  const router = useRouter();

  const { mutate: mutateLogout, isPending: isLogoutPending } =
    api.auth.logout.useMutation({ onSuccess: () => router.refresh() });

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-input/50 data-[state=open]:text-sidebar-foreground"
            >
              <Avatar className="bg-background h-8 w-8 rounded-md">
                <AvatarImage
                  src={user?.avatarKey ? `/api/files?key=${user.avatarKey}` : undefined}
                  alt={user?.firstName}
                />
                <AvatarFallback className="rounded-md">
                  {user?.firstName?.[0] ?? "M"} {user?.lastName?.[0] ?? "T"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-right text-sm leading-tight">
                <span className="truncate font-medium">
                  {user?.firstName ?? "Unknown"} {user?.lastName}
                </span>
                <span className="text-foreground truncate text-xs" dir="ltr">
                  @{user?.username ?? "unknown"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user?.avatarKey ? `/api/files?key=${user.avatarKey}` : undefined}
                    alt={user?.firstName}
                  />
                  <AvatarFallback className="rounded-lg">
                    {user?.firstName?.[0] ?? "M"} {user?.lastName?.[0] ?? "T"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-right text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user?.firstName ?? "Unknown"} {user?.lastName}
                  </span>
                  <span className="truncate text-xs" dir="ltr">
                    @{user?.username ?? "unknown"}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <UserCircleIcon />
                  تعديل الملف الشخصي
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={isLogoutPending}
              onClick={() => mutateLogout()}
            >
              {isLogoutPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <LogOut />
              )}
              تسجيل خروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
