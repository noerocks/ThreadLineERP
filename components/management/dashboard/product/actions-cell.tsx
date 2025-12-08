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
import { ProductDTO } from "@/lib/DTO/product";
import { SessionPayload } from "@/lib/zod-definitions";
import { Eye, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import z from "zod";

const ActionCell = ({ product }: { product: ProductDTO }) => {
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
        {user?.role === "SUPPLIER" && (
          <>
            <DropdownMenuItem data-id={product.id} data-action="edit">
              <Pencil />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Trash />
              Delete
            </DropdownMenuItem>
          </>
        )}
        {user?.role === "ADMIN" && (
          <DropdownMenuItem data-id={product.id} data-action="details">
            <Eye />
            View Details
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionCell;
