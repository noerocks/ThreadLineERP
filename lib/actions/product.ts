"use server";

import z from "zod";
import { AddProductFormSchema } from "../zod-definitions";
import { verifySession } from "./session";
import { createNewProduct } from "../DAL/product";

export async function addNewProduct(
  data: z.infer<typeof AddProductFormSchema>
) {
  const result = AddProductFormSchema.safeParse(data);
  if (!result.success) return { failure: { error: "Invalid form data" } };
  const session = await verifySession();
  if (!session) return { failure: { error: "Unauthenticated" } };
  try {
    const product = await createNewProduct(data);
    return { success: { message: "Product created successfuly" } };
  } catch (error) {
    const e = error as Error;
    return { failure: { error: e.message } };
  }
}
