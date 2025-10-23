import {
  Product,
  PurchaseOrder,
  PurchaseOrderItem,
  Supplier,
} from "@prisma/client";

export type PurchaseOrderDTO = PurchaseOrder & {
  supplier: Supplier;
  items: (PurchaseOrderItem & {
    product: Product;
  })[];
};
