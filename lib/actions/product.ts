"use server";

import z from "zod";
import { AddProductFormSchema } from "../zod-definitions";
import { verifySession } from "./session";
import {
  createNewProduct,
  sloppyUpdateProductById,
  updateProductById,
} from "../DAL/product";
import { revalidateTag } from "next/cache";

export async function addNewProduct(
  supplierId: string,
  data: z.infer<typeof AddProductFormSchema>
) {
  const result = AddProductFormSchema.safeParse(data);
  if (!result.success) return { failure: { error: "Invalid form data" } };
  const session = await verifySession();
  if (!session) return { failure: { error: "Unauthenticated" } };
  try {
    const product = await createNewProduct(supplierId, data);
    revalidateTag("products");
    return { success: { message: "Product created successfully" } };
  } catch (error) {
    const e = error as Error;
    return { failure: { error: e.message } };
  }
}

export async function updateProduct(
  data: z.infer<typeof AddProductFormSchema> & { id: string }
) {
  const result = AddProductFormSchema.safeParse(data);
  if (!result.success) return { failure: { error: "Invalid form data" } };
  const session = await verifySession();
  if (!session) return { failure: { error: "Unauthenticated" } };
  try {
    const product = await updateProductById(data);
    revalidateTag("products");
    return { success: { message: "Product updated successfully" } };
  } catch (error) {
    const e = error as Error;
    return { failure: { error: e.message } };
  }
}

export async function updateProductPhotoURL(
  productId: string,
  objectURL: string
) {
  if (!productId || !objectURL)
    return { failure: { error: "Invalid input data" } };
  const session = await verifySession();
  if (!session) return { failure: { error: "Unauthenticated" } };
  try {
    const product = await sloppyUpdateProductById({
      id: productId,
      photoURL: objectURL,
    });
    revalidateTag("products");
    return { success: { message: "Product image uploaded successfully" } };
  } catch (error) {
    const e = error as Error;
    return { failure: { error: e.message } };
  }
}
