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
import {
  createProductVariant,
  getProductVariantById,
  getProductVariantBySKUandProductId,
  updateProductVariantById,
} from "../DAL/product-variant";
import { createOutFlow } from "../DAL/cashflow";

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
    const purchaseOrderItems: {
      orderId: string;
      productVariantId: string;
      quantity: number;
      unitPrice: number;
      vatAmount: number;
      lineTotal: number;
    }[] = [];
    const variantSKUs: Record<string, string> = {};
    for (let i = 0; i <= cart.length - 1; i++) {
      const { product, color, size, quantity } = cart[i];
      const cost = Number(product.cost);
      const sku = `${product.category}-${product.name
        .split(" ")
        .map((word) => word[0].toUpperCase())
        .join("")}-${color}-${size}`;
      const vatAmount = cost + cost * 0.12;
      let productVariantId: string | undefined = variantSKUs[sku];
      if (!productVariantId) {
        const productVariant = await getProductVariantBySKUandProductId(
          sku,
          product.id
        );
        if (productVariant) {
          variantSKUs[sku] = productVariant.id;
          productVariantId = productVariant.id;
        } else {
          const { id } = await createProductVariant({
            sku,
            productId: product.id,
            size: product.category === "FOOTWEAR" ? null : (size as ShirtSize),
            shoeSize: product.category === "FOOTWEAR" ? Number(size) : null,
            color: color as Color,
          });
          variantSKUs[sku] = id;
          productVariantId = id;
        }
      }
      purchaseOrderItems.push({
        orderId: purchaseOrder.id,
        productVariantId,
        quantity: Number(quantity),
        unitPrice: product.cost,
        vatAmount,
        lineTotal: Number(quantity) * vatAmount,
      });
    }
    const purchaseItems = await createManyPurchaseOrderItems(
      purchaseOrderItems
    );
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
    const purchaseOrderItems = purchaseOrder.items;
    for (let i = 0; i <= purchaseOrderItems.length - 1; i++) {
      const item = purchaseOrderItems[i];
      const productVariant = await getProductVariantById(item.productVariantId);
      if (!productVariant)
        return {
          failure: {
            error: "Action interrupted. Error in fetching product variant.",
          },
        };
      const newStock = productVariant.stock + item.quantity;
      const newProductVariant = await updateProductVariantById({
        id: productVariant.id,
        stock: newStock,
      });
    }
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
    const outflowAmount = purchaseOrder.items.reduce(
      (sum, item) => (sum += item.lineTotal),
      0
    );
    const outflowVatAmount = purchaseOrder.items.reduce(
      (sum, item) => (sum += item.unitPrice * 0.12 * item.quantity),
      0
    );
    const outflow = await createOutFlow({
      poId: purchaseOrder.id,
      amount: outflowAmount,
      vatAmount: outflowVatAmount,
    });
    revalidateTag("cashflow");
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
