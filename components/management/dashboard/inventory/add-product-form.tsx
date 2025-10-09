import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus } from "lucide-react";

const AddProductForm = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus />
          Add New Product
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add New Product</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default AddProductForm;
