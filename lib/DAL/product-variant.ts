import { Color, ShirtSize } from "@prisma/client";
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
