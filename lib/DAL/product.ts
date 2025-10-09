import z from "zod";
import { AddProductFormSchema } from "../zod-definitions";
import { prisma } from "../prisma";
import { ProductStatus } from "@prisma/client";

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
    },
  });
  return product;
}
