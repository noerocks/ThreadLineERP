"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

import { CheckCircle2, Timer, Truck } from "lucide-react";
import { screamingSnakeToTitle } from "@/lib/utils";
import { SaleDTO } from "@/lib/DTO/sale";

export const columns: ColumnDef<SaleDTO>[] = [
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
    id: "customer.name",
    accessorKey: "customer.name",
    header: "Customer",
  },
  {
    accessorKey: "createdAt",
    header: "Order Date",
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
];
