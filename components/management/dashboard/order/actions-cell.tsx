"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { verifySession } from "@/lib/actions/session";
import { SaleDTO } from "@/lib/DTO/sale";
import { SessionPayload } from "@/lib/zod-definitions";
import { CheckCircle2, Eye, MoreHorizontal, Truck, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import z from "zod";

const ActionsCell = ({ sale }: { sale: SaleDTO }) => {
  const pathName = usePathname();
  const customer = useSession();
  const [authorizedUser, setAuthorizedUser] =
    useState<z.infer<typeof SessionPayload>>();
  useEffect(() => {
    async function setUser() {
      const session = await verifySession();
      setAuthorizedUser(session.user);
    }
    if (pathName.startsWith("/dashboard")) {
      setUser();
    }
  }, []);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem data-id={sale.id} data-action="view">
          <Eye />
          View Invoice
        </DropdownMenuItem>
        {sale.status === "PENDING" && (
          <DropdownMenuItem data-id={sale.id} data-action="deliver">
            <Truck />
            Deliver Items
          </DropdownMenuItem>
        )}
        {customer.status === "authenticated" &&
          !authorizedUser &&
          sale.status === "IN_TRANSIT" && (
            <DropdownMenuItem data-id={sale.id} data-action="received">
              <CheckCircle2 />
              Order Received
            </DropdownMenuItem>
          )}
        {sale.status === "ARRIVED" && !sale.paidAt && (
          <DropdownMenuItem data-id={sale.id} data-action="paid">
            <CheckCircle2 />
            Payment Received
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionsCell;
