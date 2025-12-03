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
import { Eye, ImageIcon, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { ArrowUpDown } from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { screamingSnakeToTitle } from "@/lib/utils";
import { ProductDTO } from "@/lib/DTO/product";

export const columns: ColumnDef<ProductDTO>[] = [
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product Name" />
    ),
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex items-center gap-2">
          <div className="size-5 bg-gray-200 flex items-center justify-center">
            {product.photoURL ? (
              <img src={product.photoURL} className="object-cover" />
            ) : (
              <ImageIcon size={15} className="text-gray-500" />
            )}
          </div>
          <p>{product.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const product = row.original;
      return <div className="w-[250px] truncate">{product.description}</div>;
    },
  },
  {
    header: "# Stock",
    cell: ({ row }) => {
      const product = row.original;
      const stockCount = product.variants.reduce(
        (sum, variant) => (sum += variant.stock),
        0
      );
      return <div>{stockCount}</div>;
    },
  },
  {
    header: "# Variants",
    cell: ({ row }) => {
      const product = row.original;
      return <div>{product.variants.length}</div>;
    },
  },
  {
    accessorKey: "cost",
    header: () => <div>Cost</div>,
    cell: ({ row }) => {
      const cost = parseFloat(row.getValue("cost"));
      const formatted = new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
      }).format(cost);

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      return <div>{screamingSnakeToTitle(row.getValue("category"))}</div>;
    },
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      return <div>{screamingSnakeToTitle(row.getValue("gender"))}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
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
            <DropdownMenuItem data-id={product.id} data-action="edit">
              <Pencil />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Trash />
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem data-id={product.id} data-action="details">
              <Eye />
              View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
