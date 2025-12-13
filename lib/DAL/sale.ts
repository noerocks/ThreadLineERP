import { PurchaseOrderStatus } from "@prisma/client";
import { prisma } from "../prisma";
import { unstable_cache } from "next/cache";

export async function createSale(customerId: string) {
  const sale = await prisma.sale.create({
    data: {
      status: PurchaseOrderStatus.PENDING,
      customerId,
    },
  });
  return sale;
}

export const getAllSales = unstable_cache(
  async () => {
    const sale = await prisma.sale.findMany({
      include: {
        customer: true,
        items: true,
      },
    });
    return sale;
  },
  ["getAllSales"],
  {
    tags: ["sales"],
  }
);
