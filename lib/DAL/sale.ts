import { PurchaseOrderStatus } from "@prisma/client";
import { prisma } from "../prisma";

export async function createSale(customerId: string) {
  const sale = await prisma.sale.create({
    data: {
      status: PurchaseOrderStatus.PENDING,
      customerId,
    },
  });
  return sale;
}
