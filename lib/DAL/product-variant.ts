import { Color, ProductVariant, ShirtSize } from "@prisma/client";
import { prisma } from "../prisma";

export async function createProductVariant(data: {
  sku: string;
  productId: string;
  size: ShirtSize | null;
  shoeSize: number | null;
  color: Color;
}) {
  const productVariant = await prisma.productVariant.create({
    data,
  });
  return productVariant;
}

export async function getProductVariantBySKUandProductId(
  sku: string,
  productId: string
) {
  const productVariant = await prisma.productVariant.findFirst({
    where: {
      sku,
      productId,
    },
  });
  return productVariant;
}

export async function getProductVariantById(id: string) {
  const productVariant = await prisma.productVariant.findUnique({
    where: {
      id,
    },
  });
  return productVariant;
}

export async function updateProductVariantById(data: Partial<ProductVariant>) {
  const productVariant = await prisma.productVariant.update({
    where: {
      id: data.id,
    },
    data,
  });
  return productVariant;
}
