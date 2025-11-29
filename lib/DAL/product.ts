import z from "zod";
import { AddProductFormSchema } from "../zod-definitions";
import { prisma } from "../prisma";
import { Product, ProductStatus } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { ProductDTO } from "../DTO/product";

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
      cost: Number(data.cost),
    },
  });
  return product;
}

export const getProducts = unstable_cache(
  async (): Promise<ProductDTO[]> => {
    const products = await prisma.product.findMany({
      include: {
        purchaseOrderItems: true,
      },
    });
    return products;
  },
  ["getProducts"],
  {
    tags: ["products"],
  }
);
