import { PurchaseOrderItem } from "@prisma/client";
import { prisma } from "../prisma";

export async function createManyPurchaseOrderItems(
  data: {
    orderId: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    vatAmount: number;
    lineTotal: number;
  }[]
) {
  const purchaseOrderItems = await prisma.purchaseOrderItem.createMany({
    data,
  });
  return purchaseOrderItems;
}
