import { PurchaseOrderStatus } from "@prisma/client";
import { prisma } from "../prisma";
import { unstable_cache } from "next/cache";

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

export const getAllPurchaseOrders = unstable_cache(
  async () => {
    const purchaseOrders = await prisma.purchaseOrder.findMany({
      include: {
        supplier: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    return purchaseOrders;
  },
  ["getAllPurchaseOrders"],
  {
    tags: ["purchaseOrders"],
  }
);

export async function getPurchaseOrderById(id: string) {
  const purchaseOrders = await prisma.purchaseOrder.findUnique({
    where: {
      id,
    },
    include: {
      supplier: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });
  return purchaseOrders;
}
