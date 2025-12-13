"use server";

import { verifySession } from "./session";
import { createSale as createSaleDAL } from "../DAL/sale";
import { getProductVariantById } from "../DAL/product-variant";
import { createManySaleItems } from "../DAL/sale-item";
import { revalidateTag } from "next/cache";

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
    revalidateTag("saleItems");
    return { success: { message: "Sale items created successfully" } };
  } catch (error) {
    const e = error as Error;
    console.log(e.message);
    return { failure: { error: e.message } };
  }
}
