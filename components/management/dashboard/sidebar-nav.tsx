"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Package } from "lucide-react";
import Link from "next/link";

const SidebarNavigation = () => {
  const navigation = [
    { label: "Inventory", link: "dashboard/inventory", icon: <Package /> },
  ];
  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarGroupLabel>Core Modules</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {navigation.map((nav) => (
              <SidebarMenuItem key={nav.link}>
                <SidebarMenuButton asChild>
                  <Link href={nav.link}>
                    {nav.icon}
                    {nav.label}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default SidebarNavigation;
