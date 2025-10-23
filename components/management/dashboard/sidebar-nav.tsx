"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { link } from "fs";
import { FileText, Package, Truck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarNavigation = () => {
  const pathName = usePathname();
  const navGroup = [
    {
      label: "Inventory",
      items: [
        { label: "Products", link: "/dashboard/products", icon: <Package /> },
        { label: "Suppliers", link: "/dashboard/suppliers", icon: <Truck /> },
        {
          label: "Purchase Order",
          link: "/dashboard/purchase-orders",
          icon: <FileText />,
        },
      ],
    },
  ];
  return (
    <>
      {navGroup.map((group) => (
        <SidebarGroup key={group.label}>
          <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.link}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathName.includes(item.link)}
                  >
                    <Link href={item.link}>
                      {item.icon}
                      {item.label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
};

export default SidebarNavigation;
