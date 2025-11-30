import {
  Product,
  PurchaseOrder,
  PurchaseOrderItem,
  Supplier,
} from "@prisma/client";
import { ProductVariantDTO } from "./product";

export type PurchaseOrderItemDTO = PurchaseOrderItem & {
  variant: ProductVariantDTO;
};

export type PurchaseOrderDTO = PurchaseOrder & {
  supplier: Supplier;
  items: PurchaseOrderItemDTO[];
};
