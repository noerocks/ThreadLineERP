import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus } from "lucide-react";

const AddProductSheet = () => {
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
          <SheetDescription>Provide the product details below</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default AddProductSheet;
