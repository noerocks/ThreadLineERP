"use server";

import z from "zod";
import { CustomerFormSchema } from "../zod-definitions";
import { updateUser as updateUserDAL } from "../DAL/user";

export async function updateUser(
  data: z.infer<typeof CustomerFormSchema> & { id: string }
) {
  try {
    const result = CustomerFormSchema.safeParse(data);
    if (!result.success) return { failure: { error: "Invalid form data" } };
    const user = await updateUserDAL(data);
    if (!user) return { failure: { error: "Error in updating user" } };
    return { success: { message: "Update Successfull" } };
  } catch (error) {
    const e = error as Error;
    console.log(e.message);
    return {
      failure: {
        error: e.message,
      },
    };
  }
}
