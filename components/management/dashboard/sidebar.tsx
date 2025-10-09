"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { logout } from "@/lib/actions/authentication";
import { getInitialsFromName, screamingSnakeToTitle } from "@/lib/utils";
import { SessionPayload } from "@/lib/zod-definitions";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { ChevronsUpDown, Package, Power, ShoppingBag } from "lucide-react";
import z from "zod";
import SidebarNavigation from "./sidebar-nav";

const DashboardSidebar = ({
  user,
}: {
  user: z.infer<typeof SessionPayload>;
}) => {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="flex items-center hover:bg-transparent">
              <ShoppingBag />
              <p className="text-xl">ThreadLine.</p>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavigation />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-transparent active:bg-transparent flex items-center gap-2"
            >
              <Avatar>
                <AvatarFallback>
                  {getInitialsFromName(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1">
                <p>{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <ChevronsUpDown />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="right"
                  align="end"
                  sideOffset={4}
                  className="w-56"
                >
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <Avatar>
                      <AvatarFallback>
                        {getInitialsFromName(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {screamingSnakeToTitle(user.role)}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex items-center"
                    variant="destructive"
                    onClick={async () => await logout()}
                  >
                    <Power />
                    <p>Logout</p>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
