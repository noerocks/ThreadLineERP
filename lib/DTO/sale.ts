import { Sale, SaleItem, User } from "@prisma/client";
import { ProductVariantDTO } from "./product";

export type SaleItemDTO = SaleItem & {
  productVariant: ProductVariantDTO;
};

export type SaleDTO = Sale & {
  customer: User;
  items: SaleItemDTO[];
};
