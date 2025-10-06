"use server";

import z from "zod";
import { RegisterFormSchema } from "../zod-definitions";
import { createNewUser } from "../DAL/user";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import bcrypt from "bcrypt";
import { createSession } from "./session";

export async function register(data: z.infer<typeof RegisterFormSchema>) {
  const result = RegisterFormSchema.safeParse(data);
  if (!result.success) {
    return { failure: { error: "Invalid form data" } };
  }
  const { name, role, email, birthday, address, contactNumber, password } =
    data;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await createNewUser({
      name,
      role,
      email,
      birthday,
      address,
      contactNumber,
      hashedPassword,
    });
    await createSession({
      id: user.id,
      email: user.email!,
      name: user.name!,
      role: user.role,
    });
    return { success: { message: "User registered successfuly" } };
  } catch (error) {
    console.log(error);
    const e = error as PrismaClientKnownRequestError;
    if (e.code === "P2002") {
      const duplicate = (e?.meta?.target as string[])[0];
      switch (duplicate) {
        case "email": {
          return { failure: { error: "Email is already in use" } };
        }
        default: {
          return { failure: { error: "Unique constraint violated" } };
        }
      }
    }
  }
}
