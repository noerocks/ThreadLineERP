"use server";

import { verifySession } from "./session";
import {
  createPurchaseOrder as createPurchaseOrderDAL,
  updatePurchaseOrderById,
} from "../DAL/purchase-order";
import {
  createManyPurchaseOrderItems,
  updatePurchaseItemByPurchaseOrder,
} from "../DAL/purchase-item";
import { revalidateTag } from "next/cache";
import { Color, Product, ShirtSize } from "@prisma/client";

export async function createPurchaseOrder(
  supplierId: string,
  address: string,
  cart: {
    product: Product;
    quantity: string;
    size: string;
    color: string;
  }[]
) {
  try {
    if (!supplierId || !address || !cart)
      return { failure: { error: "Invalid input" } };
    const session = await verifySession();
    if (!session) return { failure: { error: "Unauthenticated" } };
    const purchaseOrder = await createPurchaseOrderDAL(supplierId, address);
    if (!purchaseOrder)
      return { failure: { error: "Error in creating purchase order" } };
    const cartItems = cart.map((item) => {
      const cost = Number(item.product.cost);
      const vatAmount = cost + cost * 0.12;
      const isShoeSize = item.product.category === "FOOTWEAR";
      return {
        orderId: purchaseOrder.id,
        productId: item.product.id,
        quantity: Number(item.quantity),
        color: item.color as Color,
        size:
          item.product.category === "FOOTWEAR"
            ? null
            : (item.size as ShirtSize),
        shoeSize:
          item.product.category === "FOOTWEAR" ? Number(item.size) : null,
        unitPrice: cost,
        vatAmount: vatAmount,
        lineTotal: Number(item.quantity) * vatAmount,
      };
    });
    const purchaseItems = await createManyPurchaseOrderItems(cartItems);
    if (!purchaseItems)
      return { failure: { error: "Error in creating purchase order items" } };
    revalidateTag("purchaseOrders");
    return { success: { message: "Purchase order is created successfully" } };
  } catch (error) {
    const e = error as Error;
    console.log(e.message);
    return { failure: { error: e.message } };
  }
}

export async function orderReceived(purchaseOrderId: string) {
  try {
    if (!purchaseOrderId) return { failure: { error: "Invalid input" } };
    const session = await verifySession();
    if (!session) return { failure: { error: "Unauthenticated" } };
    const purchaseOrder = await updatePurchaseOrderById({
      id: purchaseOrderId,
      status: "ARRIVED",
    });
    await updatePurchaseItemByPurchaseOrder(purchaseOrderId, {
      status: "IN_STOCK",
    });
    revalidateTag("purchaseOrders");
    revalidateTag("products");
    return {
      success: {
        message:
          "Purchase order received. Newly arrived items are moved to stock.",
      },
    };
  } catch (error) {
    const e = error as Error;
    console.log(e.message);
    return { failure: { error: e.message } };
  }
}

export async function deliverItems(purchaseOrderId: string) {
  try {
    if (!purchaseOrderId) return { failure: { error: "Invalid input" } };
    const session = await verifySession();
    if (!session) return { failure: { error: "Unauthenticated" } };
    const purchaseOrder = await updatePurchaseOrderById({
      id: purchaseOrderId,
      status: "IN_TRANSIT",
    });
    revalidateTag("purchaseOrders");
    revalidateTag("products");
    return {
      success: {
        message: "Items are out for delivery",
      },
    };
  } catch (error) {
    const e = error as Error;
    console.log(e.message);
    return { failure: { error: e.message } };
  }
}
