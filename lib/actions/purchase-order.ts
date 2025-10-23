"use server";

import { ProductsDTO } from "../DTO/products";
import { verifySession } from "./session";
import { createPurchaseOrder as createPurchaseOrderDAL } from "../DAL/purchase-order";
import { createManyPurchaseOrderItems } from "../DAL/purchase-item";
import { revalidateTag } from "next/cache";

export async function createPurchaseOrder(
  supplierId: string,
  address: string,
  cart: { product: ProductsDTO; quantity: string }[]
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
      return {
        orderId: purchaseOrder.id,
        productId: item.product.id,
        quantity: Number(item.quantity),
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
    return { failure: { error: e.message } };
  }
}
