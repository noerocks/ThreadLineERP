"use client";

import { ProductDTO } from "@/lib/DTO/product";
import { Input } from "../ui/input";
import { Color, ShirtSize } from "@prisma/client";
import { Button } from "../ui/button";
import { Shirt, ShoppingCart } from "lucide-react";
import { screamingSnakeToTitle } from "@/lib/utils";

const AddToCart = ({ product }: { product: ProductDTO }) => {
  const shoeSizesUS = [5, 6, 7, 8, 9, 10, 11, 12, 13];
  const productColors = Object.values(Color).filter((color) =>
    product.variants.map((variant) => variant.color).includes(color)
  );
  return (
    <div className="grid grid-cols-2 h-[600px] my-10 mx-50 gap-20">
      <div className="h-full w-full flex items-center justify-center overflow-hidden bg-gray-50">
        <img
          src={product?.photoURL!}
          className="object-contain max-h-full max-w-full"
        />
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
        <Input type="number" className="w-[100px]" defaultValue="1" />
        <p className="text-muted-foreground">Size</p>
        <div className="flex flex-wrap gap-5">
          {(product.category !== "FOOTWEAR"
            ? Object.values(ShirtSize)
            : shoeSizesUS
          ).map((size) => (
            <Button
              variant="outline"
              className="w-[100px] rounded-none"
              key={size}
            >
              {size}
            </Button>
          ))}
        </div>
        <p className="text-muted-foreground">Color</p>
        {productColors.length > 0 ? (
          <div className="flex flex-wrap gap-5">
            {productColors.map((color) => (
              <Button
                variant="outline"
                className="w-[100px] rounded-none"
                disabled
                key={color}
              >
                {screamingSnakeToTitle(color)}
              </Button>
            ))}
          </div>
        ) : null}
        <Button>
          <ShoppingCart />
          Add to Cart
        </Button>
        <p className="text-muted-foreground">{product.description}</p>
      </div>
    </div>
  );
};

export default AddToCart;
