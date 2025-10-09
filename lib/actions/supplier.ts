"use server";

import z from "zod";
import { AddSupplierFormSchema } from "../zod-definitions";
import { verifySession } from "../actions/session";
import { createNewSupplier } from "../DAL/supplier";

export async function AddNewSupplier(
  data: z.infer<typeof AddSupplierFormSchema>
) {
  const result = AddSupplierFormSchema.safeParse(data);
  if (!result.success) return { failure: { error: "Invalid form data" } };
  const session = await verifySession();
  if (!session) return { failure: { error: "Unauthenticated" } };
  try {
    const supplier = await createNewSupplier(data);
    return { success: { message: "Supplier created successfuly" } };
  } catch (error) {
    const e = error as Error;
    return { failure: { error: e.message } };
  }
}
