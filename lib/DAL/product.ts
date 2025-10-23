import z from "zod";
import { AddProductFormSchema } from "../zod-definitions";
import { prisma } from "../prisma";
import { ProductStatus } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { ProductsDTO } from "../DTO/products";

export async function createNewProduct(
  data: z.infer<typeof AddProductFormSchema>
) {
  const product = await prisma.product.create({
    data: {
      name: data.name,
      category: data.category,
      gender: data.gender,
      status: ProductStatus.OUT_OF_STOCK,
      description: data.description,
      size: data.size,
      color: data.color,
      cost: Number(data.cost),
    },
  });
  return product;
}

export const getProducts = unstable_cache(
  async (): Promise<ProductsDTO[] | []> => {
    const products = await prisma.product.findMany();
    return products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      size: product.size,
      color: product.color,
      cost: Number(product.cost),
      price: Number(product.price),
      vatAmount: Number(product.vatAmount),
      stock: product.stock,
      category: product.category,
      gender: product.gender,
    }));
  },
  ["getProducts"],
  {
    tags: ["products"],
  }
);
