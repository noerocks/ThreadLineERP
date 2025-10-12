import z from "zod";
import { prisma } from "../prisma";
import { AddSupplierFormSchema } from "../zod-definitions";
import { SuppliersDTO } from "../DTO/suppliers";
import { unstable_cache } from "next/cache";

export async function createNewSupplier(
  data: z.infer<typeof AddSupplierFormSchema>
) {
  const supplier = await prisma.supplier.create({
    data,
  });
  return supplier;
}

export const getSuppliers = unstable_cache(
  async (): Promise<SuppliersDTO[] | []> => {
    const suppliers = await prisma.supplier.findMany();
    return suppliers.map((supplier) => ({
      name: supplier.name,
      contactName: supplier.contactName,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
    }));
  },
  ["getSuppliers"],
  {
    tags: ["suppliers"],
  }
);
