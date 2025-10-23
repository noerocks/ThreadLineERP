import { PurchaseOrderStatus } from "@prisma/client";
import { prisma } from "../prisma";

export async function createPurchaseOrder(supplierId: string, address: string) {
  const purchaseOrder = await prisma.purchaseOrder.create({
    data: {
      status: PurchaseOrderStatus.PENDING,
      supplier: {
        connect: {
          id: supplierId,
        },
      },
      address,
    },
  });
  return purchaseOrder;
}
