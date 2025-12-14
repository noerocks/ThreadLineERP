"use server";

import {
  createSale as createSaleDAL,
  getSaleById,
  updateSaleById,
} from "../DAL/sale";
import {
  getProductVariantById,
  updateProductVariantById,
} from "../DAL/product-variant";
import { createManySaleItems } from "../DAL/sale-item";
import { revalidateTag } from "next/cache";
import { verifySession } from "./session";
import { PurchaseOrderStatus } from "@prisma/client";

export async function createSale(
  userId: string,
  cartItems: { qty: number; variantId: string }[]
) {
  try {
    const sale = await createSaleDAL(userId);
    if (!sale) return { failure: { error: "Error in creating sale" } };
    const saleItems: {
      saleId: string;
      productVariantId: string;
      quantity: number;
      unitPrice: number;
      vatAmount: number;
      lineTotal: number;
    }[] = [];
    for (let i = 0; i < cartItems.length; i++) {
      const item = cartItems[i];
      const variant = await getProductVariantById(item.variantId);
      if (!variant) {
        continue;
      }
      const newStock = variant.stock - item.qty;
      await updateProductVariantById({ id: variant.id, stock: newStock });
      const vatAmount =
        variant?.product?.price! + variant?.product?.price! * 0.12;
      const saleItem = {
        saleId: sale.id,
        productVariantId: item.variantId,
        quantity: Number(item.qty),
        unitPrice: variant?.product.price || 0,
        vatAmount,
        lineTotal: vatAmount * Number(item.qty),
      };
      saleItems.push(saleItem);
    }
    const manySaleItems = await createManySaleItems(saleItems);
    if (!manySaleItems)
      return { failure: { error: "Error in creating sale items" } };
    revalidateTag("products");
    revalidateTag("sales");
    return { success: { message: "Sale items created successfully" } };
  } catch (error) {
    const e = error as Error;
    console.log(e.message);
    return { failure: { error: e.message } };
  }
}

export async function deliverItems(saleId: string) {
  const session = await verifySession();
  if (!session) return { failure: { error: "Unauthenticated" } };
  try {
    const sale = await updateSaleById({
      id: saleId,
      status: PurchaseOrderStatus.IN_TRANSIT,
    });
    revalidateTag("sales");
    return { success: { message: "Items are out for delivery" } };
  } catch (error) {
    const e = error as Error;
    console.log(e.message);
    return { failure: { error: e.message } };
  }
}

export async function orderReceived(saleId: string) {
  try {
    const sale = await updateSaleById({
      id: saleId,
      status: PurchaseOrderStatus.ARRIVED,
    });
    if (!sale) return { failure: { error: "Error in updating sale" } };
    revalidateTag("sales");
    return { success: { message: "Orders received" } };
  } catch (error) {
    const e = error as Error;
    console.log(e.message);
    return { failure: { error: e.message } };
  }
}

export async function paymentReceived(saleId: string) {
  try {
    const sale = await updateSaleById({
      id: saleId,
      paidAt: new Date(),
    });
    if (!sale) return { failure: { error: "Error in updating sale" } };
    revalidateTag("sales");
    return { success: { message: "Payment Received" } };
  } catch (error) {
    const e = error as Error;
    console.log(e.message);
    return { failure: { error: e.message } };
  }
}
