"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SessionPayload } from "@/lib/zod-definitions";
import { UserRole } from "@prisma/client";
import { link } from "fs";
import { FileText, Package, ShoppingBag, Truck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import z from "zod";

const SidebarNavigation = ({
  user,
}: {
  user: z.infer<typeof SessionPayload>;
}) => {
  const pathName = usePathname();
  const navGroup = [
    {
      label: "Inventory",
      items: [
        {
          label: "Products",
          link: "/dashboard/products",
          icon: <Package />,
          authorizedUsers: [UserRole.ADMIN, UserRole.SUPPLIER],
        },
        {
          label: "Suppliers",
          link: "/dashboard/suppliers",
          icon: <Truck />,
          authorizedUsers: [UserRole.ADMIN],
        },
        {
          label: "Purchase Order",
          link: "/dashboard/purchase-orders",
          icon: <FileText />,
          authorizedUsers: [UserRole.ADMIN, UserRole.SUPPLIER],
        },
      ],
    },
    {
      label: "Sales and Finance",
      items: [
        {
          label: "Online Orders",
          link: "/dashboard/orders",
          icon: <ShoppingBag />,
          authorizedUsers: [UserRole.ADMIN],
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
              {group.items.map((item) =>
                (item.authorizedUsers as UserRole[]).includes(user.role) ? (
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
                ) : null
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
};

export default SidebarNavigation;
