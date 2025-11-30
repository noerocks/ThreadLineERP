import { Product, ProductVariant, PurchaseOrderItem } from "@prisma/client";

export type ProductVariantDTO = ProductVariant & {
  purchaseOrderItems: PurchaseOrderItem[];
  product?: Product;
};

export type ProductDTO = Product & {
  variants: ProductVariantDTO[];
};
