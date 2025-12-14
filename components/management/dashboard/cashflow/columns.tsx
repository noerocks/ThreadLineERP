"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { CashFlow } from "@prisma/client";
import { screamingSnakeToTitle } from "@/lib/utils";

export const columns: ColumnDef<CashFlow>[] = [
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
    id: "type",
    accessorKey: "type",
    header: "Cashflow Type",
    cell: ({ row }) => {
      return <div>{screamingSnakeToTitle(row.original.type)}</div>;
    },
  },
  {
    id: "source",
    accessorKey: "source",
    header: "Cashflow Source",
    cell: ({ row }) => {
      return <div>{screamingSnakeToTitle(row.original.source)}</div>;
    },
  },
  {
    id: "amount",
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      return (
        <div>
          {new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
          }).format(row.original.amount)}
        </div>
      );
    },
  },
  {
    id: "vatAmount",
    accessorKey: "vatAmount",
    header: "VAT Amount",
    cell: ({ row }) => {
      return (
        <div>
          {new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
          }).format(row.original.vatAmount!)}
        </div>
      );
    },
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const po = row.original;
      return <div>{new Date(po.createdAt).toLocaleDateString("en-US")}</div>;
    },
  },
];
