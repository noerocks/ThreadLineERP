"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle2, Eye, MoreHorizontal, Timer, Truck } from "lucide-react";
import { PurchaseOrderDTO } from "@/lib/DTO/purchase-orders";
import { screamingSnakeToTitle } from "@/lib/utils";
import ActionsCell from "./actions-cell";

export const columns: ColumnDef<PurchaseOrderDTO>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "supplier.name",
    accessorKey: "supplier.name",
    header: "Supplier",
  },
  {
    accessorKey: "createdAt",
    header: "Date issued",
    cell: ({ row }) => {
      const po = row.original;
      return <div>{new Date(po.createdAt).toLocaleDateString("en-US")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const po = row.original;
      let icon;
      switch (po.status) {
        case "PENDING":
          icon = <Timer size={15} className="text-muted-foreground" />;
          break;
        case "ARRIVED":
          icon = <CheckCircle2 size={15} className="text-muted-foreground" />;
          break;
        case "IN_TRANSIT":
          icon = <Truck size={15} className="text-muted-foreground" />;
          break;
      }
      return (
        <div className="flex items-center gap-1">
          {icon}
          <p>{screamingSnakeToTitle(po.status)}</p>
        </div>
      );
    },
  },
  {
    header: "Drop Location",
    cell: ({ row }) => {
      const po = row.original;
      return <div>{po.address}</div>;
    },
  },
  {
    header: "# Products",
    cell: ({ row }) => {
      const po = row.original;
      return <div>{po.items.length}</div>;
    },
  },
  {
    header: "# Items",
    cell: ({ row }) => {
      const po = row.original;
      return (
        <div>{po.items.reduce((sum, item) => (sum += item.quantity), 0)}</div>
      );
    },
  },
  {
    header: "Total Amount",
    cell: ({ row }) => {
      const po = row.original;
      return (
        <div>
          {new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
          }).format(
            po.items.reduce((sum, item) => (sum += Number(item.lineTotal)), 0)
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const po = row.original;
      return <ActionsCell po={po} />;
    },
  },
];
