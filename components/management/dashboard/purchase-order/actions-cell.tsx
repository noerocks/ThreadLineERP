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
import { PurchaseOrderDTO } from "@/lib/DTO/purchase-orders";
import { SessionPayload } from "@/lib/zod-definitions";
import { CheckCircle, Eye, MoreHorizontal, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import z from "zod";

const ActionsCell = ({ po }: { po: PurchaseOrderDTO }) => {
  const [user, setUser] = useState<z.infer<typeof SessionPayload>>();
  useEffect(() => {
    async function setCurrentUser() {
      const { user: currentUser } = await verifySession();
      setUser(currentUser);
    }
    setCurrentUser();
  }, []);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem data-id={po.id} data-action="view">
          <Eye />
          View
        </DropdownMenuItem>
        {user?.role === "ADMIN" && po.status === "IN_TRANSIT" && (
          <DropdownMenuItem data-id={po.id} data-action="received">
            <CheckCircle />
            Order Received
          </DropdownMenuItem>
        )}
        {user?.role === "SUPPLIER" && po.status === "PENDING" && (
          <DropdownMenuItem data-id={po.id} data-action="deliver">
            <Truck />
            Deliver Items
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionsCell;
