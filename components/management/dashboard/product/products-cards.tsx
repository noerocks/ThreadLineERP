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
import { SuppliersDTO } from "@/lib/DTO/suppliers";
import { Filter, Package, Search, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import CreatePurchaseOrderForm from "../purchase-order/create-purchase-order-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Category, Color, Product, ShirtSize } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, screamingSnakeToTitle } from "@/lib/utils";

type CartItem = {
  product: Product;
  quantity: string;
  size: string;
  color: string;
};

const ProductsCards = ({
  products,
  suppliers,
}: {
  products: Product[];
  suppliers: SuppliersDTO[];
}) => {
  const [visibleProducts, setVisibleProducts] = useState<Product[]>(products);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>();
  useEffect(() => {
    const filteredProducts = [...products].filter((product) => {
      const matchesSearch =
        !search || new RegExp(search, "i").test(product.name);
      const matchesCategory =
        !category || category === "ALL" || product.category === category;
      return matchesSearch && matchesCategory;
    });
    setVisibleProducts(filteredProducts);
  }, [search, category]);
  const handleAddToCart = (e: React.MouseEvent<HTMLDivElement>) => {
    const button =
      ((e.target as HTMLElement).closest(
        "button[data-id]"
      ) as HTMLButtonElement) || null;
    if (!button) return;
    const productId = button.dataset.id;
    const card = button.closest("[data-card]");
    const qty = card?.querySelector("[data-qty]") as HTMLInputElement;
    const size = card?.querySelector("[data-size]") as HTMLElement;
    const color = card?.querySelector("[data-color]") as HTMLElement;
    if (
      Number(qty.value) <= 0 ||
      size.textContent === "Size" ||
      color.textContent === "Color"
    )
      return;
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    setCart((prevItems) => [
      ...prevItems,
      {
        product,
        quantity: qty.value,
        size: size.textContent,
        color: color.textContent.toUpperCase(),
      },
    ]);
    toast.success("Item added to cart");
  };
  const shoeSizesUS = [5, 6, 7, 8, 9, 10, 11, 12, 13];
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="flex items-center gap-1">
            <Filter size={20} className="text-muted-foreground" />
            Filter
          </p>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((supplier) => (
                <SelectItem value={supplier.id} key={supplier.id}>
                  {supplier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={category}
            onValueChange={(value) => setCategory(value as Category)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {["ALL", ...Object.values(Category)].map((cat) => (
                <SelectItem value={cat} key={cat}>
                  {screamingSnakeToTitle(cat)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="relative w-[450px]">
          <Search
            size={20}
            className="absolute text-muted-foreground top-[50%] -translate-y-[50%] left-2"
          />
          <Input
            className="px-10"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-5" onClick={handleAddToCart}>
        {visibleProducts.map((product) => (
          <Card
            data-card={true}
            key={product.id}
            className="basis-[calc(25%-1rem)] pt-0 overflow-hidden border rounded-md flex flex-col"
          >
            <div
              className={cn(
                "h-[150px] w-full flex items-center justify-center bg-background",
                {
                  "bg-gray-50": product.photoURL,
                }
              )}
            >
              {product.photoURL ? (
                <img src={product.photoURL} className="object-contain h-full" />
              ) : (
                <Package size={100} className="text-gray-300" />
              )}
            </div>
            <CardContent className="flex-1 flex flex-col gap-2">
              <p className="text-sm flex-1">{product.name}</p>
              <p className="text-sm text-muted-foreground flex-1">
                {product.description}
              </p>
              <div className="flex items-center gap-2 flex-1">
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Size" data-size />
                  </SelectTrigger>
                  <SelectContent>
                    {(product.category !== "FOOTWEAR"
                      ? Object.values(ShirtSize)
                      : shoeSizesUS
                    ).map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Color" data-color />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Color).map((color) => (
                      <SelectItem key={color} value={color}>
                        {screamingSnakeToTitle(color)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="font-semibold text-xl">
                {new Intl.NumberFormat("en-PH", {
                  style: "currency",
                  currency: "PHP",
                }).format(product.cost)}
              </p>
            </CardContent>
            <div className="flex items-center justify-end gap-2 px-5">
              <Input
                defaultValue="0"
                type="number"
                className="w-[70px] focus-visible:ring-0 focus:ring-0 outline-0"
                data-qty
              />
              <Button size="icon-sm" data-id={product.id}>
                <ShoppingCart />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductsCards;
