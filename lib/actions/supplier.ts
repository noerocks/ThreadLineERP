"use server";

import z from "zod";
import { AddSupplierFormSchema } from "../zod-definitions";
import { verifySession } from "../actions/session";
import { createNewSupplier } from "../DAL/supplier";
import { revalidateTag } from "next/cache";
import { createNewUser } from "../DAL/user";
import { UserRole } from "@prisma/client";
import bycrpt from "bcrypt";

export async function AddNewSupplier(
  data: z.infer<typeof AddSupplierFormSchema>
) {
  const result = AddSupplierFormSchema.safeParse(data);
  if (!result.success) return { failure: { error: "Invalid form data" } };
  const session = await verifySession();
  if (!session) return { failure: { error: "Unauthenticated" } };
  try {
    const supplier = await createNewSupplier(data);
    const {
      name: supplierName,
      contactName: name,
      email,
      phone: contactNumber,
      address,
    } = data;
    const password = `supplier${supplierName.split(" ").join("")}`;
    const hashedPassword = await bycrpt.hash(password, 10);
    await createNewUser({
      id: supplier.id,
      name,
      email,
      role: UserRole.SUPPLIER,
      hashedPassword,
      contactNumber,
    });
    revalidateTag("suppliers");
    return { success: { message: "Supplier created successfuly" } };
  } catch (error) {
    const e = error as Error;
    return { failure: { error: e.message } };
  }
}
