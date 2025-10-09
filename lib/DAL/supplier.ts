import z from "zod";
import { prisma } from "../prisma";
import { AddSupplierFormSchema } from "../zod-definitions";

export async function createNewSupplier(
  data: z.infer<typeof AddSupplierFormSchema>
) {
  const supplier = await prisma.supplier.create({
    data,
  });
  return supplier;
}
