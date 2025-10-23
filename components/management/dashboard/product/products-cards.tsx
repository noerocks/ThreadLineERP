"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProductsDTO } from "@/lib/DTO/products";
import { SuppliersDTO } from "@/lib/DTO/suppliers";
import { Package, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import CreatePurchaseOrderForm from "../purchase-order/create-purchase-order-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

type CartItem = {
  product: ProductsDTO;
  quantity: string;
};

const ProductsCards = ({
  products,
  suppliers,
}: {
  products: ProductsDTO[];
  suppliers: SuppliersDTO[];
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const handleAddToCart = (e: React.MouseEvent<HTMLDivElement>) => {
    const button =
      ((e.target as HTMLElement).closest(
        "button[data-id]"
      ) as HTMLButtonElement) || null;
    if (!button) return;
    const productId = button.dataset.id;
    const card = button.closest("[data-card]");
    const input = card?.querySelector("input");
    const quantity = input ? input.value : 0;
    if (Number(quantity) <= 0) return;
    if (input) input.value = "0";
    const product = products.find((p) => p.id === productId);
    if (!product || !quantity) return;
    setCart((prevItems) => [...prevItems, { product, quantity }]);
    toast.success("Item added to cart");
  };
  return (
    <div className="flex flex-col gap-5 mt-5">
      <div className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Please add items to cart and finalize Purchase Order
        </p>
        <Sheet>
          <SheetTrigger asChild>
            <div className="relative">
              <ShoppingCart size={25} className="mr-5" />
              {cart.length > 0 && (
                <div className="size-2 bg-red-500 rounded-full absolute top-0 right-3" />
              )}
            </div>
          </SheetTrigger>
          <SheetContent className="h-screen py-5">
            <ScrollArea className="h-full">
              <SheetHeader>
                <SheetTitle>Create Purchase Order</SheetTitle>
              </SheetHeader>
              {cart.length > 0 ? (
                <CreatePurchaseOrderForm
                  suppliers={suppliers}
                  cart={cart}
                  resetCart={setCart}
                />
              ) : (
                <p className="text-sm text-muted-foreground text-center mt-10">
                  Cart is empty.
                </p>
              )}
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex flex-wrap gap-5" onClick={handleAddToCart}>
        {products.map((product) => (
          <Card
            data-card={true}
            key={product.id}
            className="basis-[calc(25%-1rem)] pt-0 overflow-hidden border-2"
          >
            <div className="h-[150px] bg-background flex items-center justify-center">
              <Package size={100} className="text-gray-300" />
            </div>
            <CardContent>
              <div className="flex flex-col gap-2">
                <p className="text-sm">{product.name}</p>
                <p className="text-sm text-muted-foreground">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Size:{" "}
                    <span className="text-foreground">{product.size}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Color:{" "}
                    <span className="text-foreground">{product.color}</span>
                  </p>
                </div>
                <p className="font-semibold text-xl">
                  {new Intl.NumberFormat("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  }).format(product.cost)}
                </p>
              </div>
            </CardContent>
            <div className="flex items-center justify-end gap-2 px-5">
              <Input
                defaultValue="0"
                type="number"
                className="w-[70px] focus-visible:ring-0 focus:ring-0 outline-0"
              />
              <Button size="icon-sm" data-id={product.id}>
                <Plus />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductsCards;
