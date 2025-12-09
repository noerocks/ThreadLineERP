"use client";

import { ProductDTO } from "@/lib/DTO/product";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { SuppliersDTO } from "@/lib/DTO/suppliers";
import Link from "next/link";

const ProductsCards = ({
  products,
  suppliers,
}: {
  products: ProductDTO[];
  suppliers: SuppliersDTO[];
}) => {
  const [visibleProducts, setVisibleProducts] = useState<ProductDTO[]>([]);
  const [search, setSearch] = useState<string>("");
  const [supplier, setSupplier] = useState<string>("");
  useEffect(() => {
    const filteredProducts = [...products].filter((product) => {
      const matchesSearch = search
        ? new RegExp(search, "i").test(product.name)
        : true;
      const matchesSupplier = supplier ? product.supplierId === supplier : true;
      return matchesSearch && matchesSupplier;
    });
    setVisibleProducts(filteredProducts);
  }, [search, supplier]);
  return (
    <div className="flex flex-col gap-5 px-20 py-5">
      <div className="flex items-center gap-2">
        <div className="relative w-[500px]">
          <Search
            size={20}
            className="text-muted-foreground absolute top-[50%] -translate-y-[50%] left-2"
          />
          <Input
            className="px-10"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
        <Select
          value={supplier}
          onValueChange={(value) => {
            setSupplier(value);
          }}
        >
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
      </div>
      <div className="grid grid-cols-4 gap-10">
        {visibleProducts.map((product) => {
          const inStock = product.variants.some((variant) => variant.stock > 0);
          return (
            <div key={product.id}>
              <div className="h-[300px] bg-gray-50 relative">
                <img
                  src={product.photoURL!}
                  className="object-contain w-full h-full"
                />
                <div className="absolute w-full h-full top-0 bg-black/50 flex items-center justify-center">
                  <p className="bg-background/80 px-5 py-2 text-sm">
                    Out of Stock
                  </p>
                </div>
              </div>
              <div className="flex flex-col h-20 my-2">
                <Link
                  href={`/product/${product.id}`}
                  className="text-sm flex-1 hover:underline underline-offset-4"
                >
                  {product.name}
                </Link>
                <p className="text-sm text-muted-foreground flex-1">
                  {product.description}
                </p>
                <p className="flex-1 text-xl">
                  {new Intl.NumberFormat("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  }).format(product.price)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductsCards;
