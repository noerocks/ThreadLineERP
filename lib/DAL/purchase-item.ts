import { Color, PurchaseOrderItem, ShirtSize } from "@prisma/client";
import { prisma } from "../prisma";

export async function createManyPurchaseOrderItems(
  data: {
    orderId: string;
    productId: string;
    size: ShirtSize | null;
    shoeSize: number | null;
    color: Color;
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

export async function updatePurchaseItemByPurchaseOrder(
  orderId: string,
  data: Partial<PurchaseOrderItem>
) {
  const purchaseOrderItem = await prisma.purchaseOrderItem.updateMany({
    where: {
      orderId,
    },
    data,
  });
  return purchaseOrderItem;
}
