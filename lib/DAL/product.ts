import z from "zod";
import { AddProductFormSchema } from "../zod-definitions";
import { prisma } from "../prisma";
import { Category, Product, ProductStatus } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { ProductDTO } from "../DTO/product";

export async function createNewProduct(
  supplierId: string,
  data: z.infer<typeof AddProductFormSchema>
) {
  const product = await prisma.product.create({
    data: {
      supplierId,
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

export async function updateProductById(
  data: z.infer<typeof AddProductFormSchema> & { id: string }
) {
  const product = await prisma.product.update({
    where: {
      id: data.id,
    },
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

export async function sloppyUpdateProductById(data: Partial<Product>) {
  const product = await prisma.product.update({
    where: {
      id: data.id,
    },
    data,
  });
  return product;
}

export const getProducts = unstable_cache(
  async (): Promise<ProductDTO[]> => {
    const products = await prisma.product.findMany({
      include: {
        variants: {
          include: {
            purchaseOrderItems: true,
          },
        },
      },
    });
    return products;
  },
  ["getProducts"],
  {
    tags: ["products"],
  }
);

export const getProductsByCategory = unstable_cache(
  async (category: Category): Promise<ProductDTO[]> => {
    const products = await prisma.product.findMany({
      where: {
        category,
      },
      include: {
        variants: {
          include: {
            purchaseOrderItems: true,
          },
        },
      },
    });
    return products;
  },
  ["getProducts"],
  {
    tags: ["products"],
  }
);

export const getProductsBySupplierId = unstable_cache(
  async (supplierId: string): Promise<ProductDTO[]> => {
    const products = await prisma.product.findMany({
      where: {
        supplierId,
      },
      include: {
        variants: {
          include: {
            purchaseOrderItems: true,
          },
        },
      },
    });
    return products;
  },
  ["getProducts"],
  {
    tags: ["products"],
  }
);
