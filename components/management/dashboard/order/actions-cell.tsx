import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SaleDTO } from "@/lib/DTO/sale";
import { Eye, MoreHorizontal, Truck } from "lucide-react";

const ActionsCell = ({ sale }: { sale: SaleDTO }) => {
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
          View
        </DropdownMenuItem>
        {sale.status === "PENDING" && (
          <DropdownMenuItem data-id={sale.id} data-action="deliver">
            <Truck />
            Deliver Items
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionsCell;
