import { Product, PurchaseOrderItem } from "@prisma/client";

export type ProductDTO = Product & {
  purchaseOrderItems: PurchaseOrderItem[];
};
