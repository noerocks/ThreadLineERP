import { PurchaseOrderStatus, Sale } from "@prisma/client";
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
        items: {
          include: {
            productVariant: {
              include: {
                product: true,
                purchaseOrderItems: true,
              },
            },
          },
        },
      },
    });
    return sale;
  },
  ["getAllSales"],
  {
    tags: ["sales"],
  }
);

export const getAllSalesByCustomerId = unstable_cache(
  async (customerId: string) => {
    const sale = await prisma.sale.findMany({
      where: {
        customerId,
      },
      include: {
        customer: true,
        items: {
          include: {
            productVariant: {
              include: {
                product: true,
                purchaseOrderItems: true,
              },
            },
          },
        },
      },
    });
    return sale;
  },
  ["getAllSales"],
  {
    tags: ["sales"],
  }
);

export async function getSaleById(id: string) {
  const sale = await prisma.sale.findUnique({
    where: {
      id,
    },
    include: {
      customer: true,
      items: {
        include: {
          productVariant: {
            include: {
              product: true,
              purchaseOrderItems: true,
            },
          },
        },
      },
    },
  });
  return sale;
}

export async function updateSaleById(data: Partial<Sale>) {
  const sale = await prisma.sale.update({
    where: {
      id: data.id,
    },
    data,
    include: {
      items: true,
    },
  });
  return sale;
}
