"use client";

import { ProductDTO, ProductVariantDTO } from "@/lib/DTO/product";
import { Input } from "../ui/input";
import { Color, ShirtSize } from "@prisma/client";
import { Button } from "../ui/button";
import { RotateCcw, ShoppingCart } from "lucide-react";
import { cn, screamingSnakeToTitle } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const AddToCart = ({ product }: { product: ProductDTO }) => {
  const inStockVariants = product.variants.filter(
    (variant) => variant.stock > 0
  );
  const variantSizes = inStockVariants.map((variant) =>
    product.category !== "FOOTWEAR" ? variant.size : variant.shoeSize
  );
  const shoeSizesUS = [5, 6, 7, 8, 9, 10, 11, 12, 13];
  const productColors = Object.values(Color).filter((color) =>
    inStockVariants.map((variant) => variant.color).includes(color)
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    undefined
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined
  );
  const [sizeColors, setSizeColors] = useState<string[]>(productColors);
  const [selectedVariant, setSelectedVariant] = useState<
    ProductVariantDTO | undefined
  >(undefined);
  const [quantity, setQuantity] = useState<number>(1);
  useEffect(() => {
    if (selectedSize) {
      const filteredSizeColors = inStockVariants
        .filter(
          (variant) =>
            (product.category !== "FOOTWEAR"
              ? variant.size
              : String(variant.shoeSize)) === selectedSize
        )
        .map((variant) => variant.color);
      setSizeColors(filteredSizeColors);
    }
    if (selectedSize && selectedColor) {
      const variant = product.variants.find(
        (variant) =>
          (product.category !== "FOOTWEAR"
            ? variant.size
            : String(variant.shoeSize)) === selectedSize &&
          variant.color === selectedColor
      );
      setSelectedVariant(variant);
    } else {
      setSelectedVariant(undefined);
    }
  }, [selectedSize, selectedColor]);
  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const newCart = [
      ...cart,
      { qty: quantity, variantId: selectedVariant?.id },
    ];
    localStorage.setItem("cart", JSON.stringify(newCart));
    toast.success("Items added to cart");
    reset();
  };
  const reset = () => {
    setSelectedSize(undefined);
    setSelectedColor(undefined);
    setQuantity(1);
  };
  return (
    <div className="grid grid-cols-2 h-[600px] my-10 mx-50 gap-20">
      <div className="h-full w-full flex items-center justify-center overflow-hidden bg-gray-50 relative">
        <img
          src={product?.photoURL!}
          className="object-contain max-h-full max-w-full"
        />
        {inStockVariants.length === 0 && (
          <div className="absolute w-full h-full top-0 bg-black/50 flex items-center justify-center">
            <p className="bg-background/80 px-5 py-2 text-sm">Out of Stock</p>
          </div>
        )}
      </div>
      <div className="h-full flex flex-col gap-5">
        <p className="text-4xl">{product?.name}</p>
        <p className="text-xl">
          {new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
          }).format(product?.price!)}
        </p>
        <p className="text-muted-foreground">Quantity</p>
        <Input
          type="number"
          className="w-[100px]"
          disabled={!selectedVariant}
          min="1"
          max={selectedVariant ? selectedVariant.stock : 1}
          value={quantity}
          onChange={(e) => {
            setQuantity(Number(e.target.value));
          }}
        />
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Size</p>
          {selectedSize && (
            <RotateCcw
              size={15}
              className="text-muted-foreground"
              onClick={() => {
                reset();
              }}
            />
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          {(product.category !== "FOOTWEAR"
            ? Object.values(ShirtSize)
            : shoeSizesUS
          ).map((size) => (
            <Button
              variant="outline"
              className={cn("w-[100px] rounded-none", {
                "border-foreground border-2": selectedSize === String(size),
              })}
              key={size}
              disabled={
                !variantSizes.includes(size) ||
                (selectedSize !== undefined && selectedSize !== String(size))
              }
              onClick={() => {
                setSelectedSize(String(size));
              }}
            >
              {size}
            </Button>
          ))}
        </div>
        {productColors.length > 0 ? (
          <>
            <p className="text-muted-foreground">Color</p>
            <div className="flex flex-wrap gap-3">
              {productColors.map((color) => (
                <Button
                  variant="outline"
                  className={cn("w-[100px] rounded-none", {
                    "border-foreground border-2": selectedColor === color,
                  })}
                  disabled={
                    !selectedSize ||
                    !sizeColors.includes(color) ||
                    (selectedColor !== undefined && selectedColor !== color)
                  }
                  key={color}
                  onClick={() => {
                    setSelectedColor(color);
                  }}
                >
                  {screamingSnakeToTitle(color)}
                </Button>
              ))}
            </div>
          </>
        ) : null}
        {selectedVariant && (
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">{selectedVariant.sku}</p>
            <p className="text-muted-foreground">{`Stock: ${selectedVariant.stock}`}</p>
          </div>
        )}
        <Button disabled={!selectedVariant} onClick={addToCart}>
          <ShoppingCart />
          Add to Cart
        </Button>
        <p className="text-muted-foreground">{product.description}</p>
      </div>
    </div>
  );
};

export default AddToCart;
