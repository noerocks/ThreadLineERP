"use client";

import { ProductVariantDTO } from "@/lib/DTO/product";
import { useEffect, useState, useTransition } from "react";
import { Card, CardContent } from "../ui/card";
import { Loader2, ShoppingCart, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { User } from "next-auth";
import { toast } from "sonner";
import { createSale } from "@/lib/actions/sale";
import Link from "next/link";

const CartItems = ({
  variants,
  user,
}: {
  variants: ProductVariantDTO[];
  user: User | undefined;
}) => {
  const [cart, setCart] = useState<{ qty: number; variantId: string }[]>([]);
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(items);
  }, []);
  const deleteItem = (id: string) => {
    const newItems = [...cart].filter((item) => item.variantId !== id);
    setCart(newItems);
    localStorage.setItem("cart", JSON.stringify(newItems));
  };
  const plus = (id: string) => {
    const variant = variants.find((variant) => variant.id === id);
    const cartItem = cart.find((item) => item.variantId === id);
    const newItems = [...cart].map((item) => {
      if (id !== item.variantId || cartItem?.qty === variant?.stock)
        return item;
      return { qty: ++item.qty, variantId: item.variantId };
    });
    setCart(newItems);
    localStorage.setItem("cart", JSON.stringify(newItems));
  };
  const minus = (id: string) => {
    const cartItem = cart.find((item) => item.variantId === id);
    if (cartItem?.qty === 1) {
      deleteItem(id);
      return;
    }
    const newItems = [...cart].map((item) => {
      if (id !== item.variantId) return item;
      return { qty: --item.qty, variantId: item.variantId };
    });
    setCart(newItems);
    localStorage.setItem("cart", JSON.stringify(newItems));
  };
  const [pending, startTransition] = useTransition();
  const checkout = async () => {
    startTransition(async () => {
      if (!user) {
        toast.error("Please login to your Google account first to continue.");
        return;
      }
      const result = await createSale(user?.id!, cart);
      if (result.failure) {
        toast.error(result.failure.error);
        return;
      }
      if (result.success) {
        setCart([]);
        localStorage.removeItem("cart");
        toast.success(result.success.message);
        return;
      }
    });
  };
  return (
    <div className="flex flex-col gap-5 mx-50 my-10">
      <p className="text-xl flex items-center gap-2">
        <ShoppingCart />
        Your Cart
      </p>
      {cart.length !== 0 && (
        <Card className="bg-background">
          <CardContent className="flex items-center">
            <p className="flex-1 text-center text-muted-foreground">
              Product Image
            </p>
            <p className="flex-1 text-center text-muted-foreground">
              Product Details
            </p>
            <p className="flex-1 text-center text-muted-foreground">Price</p>
            <p className="flex-1 text-center text-muted-foreground">Quantity</p>
            <p className="flex-1 text-center text-muted-foreground">
              Total Price
            </p>
            <p className="flex-1 text-center text-muted-foreground">Actions</p>
          </CardContent>
        </Card>
      )}
      {cart.length > 0 ? (
        cart.map((item, i) => {
          const variant = variants.find(
            (variant) => variant.id === item.variantId
          );
          return (
            <Card key={i}>
              <CardContent className="flex items-center">
                <div className="flex-1 text-center">
                  <div className="w-[100px] h-[100px] bg-gray-100">
                    <img
                      src={variant?.product?.photoURL!}
                      className="object-contain h-full w-full"
                    />
                  </div>
                </div>
                <div className="flex-1 text-center">
                  <p className="text-lg">{variant?.product?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {variant?.sku}
                  </p>
                </div>
                <p className="flex-1 text-center">
                  {new Intl.NumberFormat("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  }).format(variant?.product?.price!)}
                </p>
                <div className="flex-1 flex justify-center">
                  <p
                    className="p-2 border text-muted-foreground cursor-pointer"
                    onClick={() => {
                      minus(item.variantId);
                    }}
                  >
                    -
                  </p>
                  <p className="text-center text-sm border px-5 py-2">
                    {item.qty}
                  </p>
                  <p
                    className="p-2 border text-muted-foreground cursor-pointer"
                    onClick={() => {
                      plus(item.variantId);
                    }}
                  >
                    +
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-center">
                    {new Intl.NumberFormat("en-PH", {
                      style: "currency",
                      currency: "PHP",
                    }).format(
                      (variant?.product?.price! +
                        variant?.product?.price! * 0.12) *
                        item.qty
                    )}
                  </p>
                  <p className="text-center text-sm text-muted-foreground">
                    +12% VAT
                  </p>
                </div>
                <div
                  className="flex-1 flex items-center justify-center"
                  onClick={() => {
                    deleteItem(item.variantId);
                  }}
                >
                  <Trash
                    className="cursor-pointer text-destructive"
                    size={20}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })
      ) : (
        <div className="flex flex-col w-full items-center pt-50 gap-5">
          <p className="text-center text-muted-foreground">
            Your cart is empty.
          </p>
          <Link href={"/"}>
            <Button>
              <ShoppingCart />
              Continue Shopping
            </Button>
          </Link>
        </div>
      )}
      {cart.length !== 0 && (
        <Card className="bg-background">
          <CardContent className="flex justify-between items-center">
            <div className="flex flex-col items-end">
              <div className="w-[300px] flex justify-between">
                <p>Shipping fee:</p>
                <p>
                  {new Intl.NumberFormat("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  }).format(100)}
                </p>
              </div>
              <div className="w-[300px] flex justify-between">
                <p>Subtotal:</p>
                <p>
                  {new Intl.NumberFormat("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  }).format(
                    cart.reduce((sum, item) => {
                      const variant = variants.find(
                        (variant) => variant.id === item.variantId
                      );
                      return (sum +=
                        (variant?.product?.price! +
                          variant?.product?.price! * 0.12) *
                        item.qty);
                    }, 0)
                  )}
                </p>
              </div>
              <div className="w-[300px] flex items-center justify-between">
                <p>Total Payment:</p>
                <p className="text-xl font-bold">
                  {new Intl.NumberFormat("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  }).format(
                    cart.reduce((sum, item) => {
                      const variant = variants.find(
                        (variant) => variant.id === item.variantId
                      );
                      return (sum +=
                        (variant?.product?.price! +
                          variant?.product?.price! * 0.12) *
                        item.qty);
                    }, 0) + 100
                  )}
                </p>
              </div>
            </div>
            <Button
              className="px-20 py-5"
              onClick={checkout}
              disabled={pending}
            >
              {pending ? (
                <>
                  <Loader2 className="animate-spin" />
                  Checkout
                </>
              ) : (
                "Checkout"
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CartItems;
