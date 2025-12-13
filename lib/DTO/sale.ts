import { Sale, SaleItem, User } from "@prisma/client";

export type SaleDTO = Sale & {
  customer: User;
  items: SaleItem[];
};
