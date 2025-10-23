import { Category } from "@prisma/client";

export type ProductsDTO = {
  id: string;
  name: string;
  description: string | null;
  size: string | null;
  color: string | null;
  cost: number;
  price: number;
  vatAmount: number;
  stock: number;
  category: Category;
  gender: string;
};
