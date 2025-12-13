import { unstable_cache } from "next/cache";
import { prisma } from "../prisma";

export async function createManySaleItems(
  data: {
    saleId: string;
    productVariantId: string;
    quantity: number;
    unitPrice: number;
    vatAmount: number;
    lineTotal: number;
  }[]
) {
  const saleItems = await prisma.saleItem.createMany({
    data,
  });
  return saleItems;
}

export const getAllSaleItems = unstable_cache(
  async () => {
    const saleItems = await prisma.saleItem.findMany();
    return saleItems;
  },
  ["getAllSaleItems"],
  {
    tags: ["saleItems"],
  }
);
