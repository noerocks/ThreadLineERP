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
import { Eye, MoreHorizontal } from "lucide-react";
import { PurchaseOrderDTO } from "@/lib/DTO/purchase-orders";

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
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
