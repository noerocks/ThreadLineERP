"use server";

import z from "zod";
import { LoginFormSchema, RegisterFormSchema } from "../zod-definitions";
import { createNewUser, findUserByEmail } from "../DAL/user";
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

export async function login(data: z.infer<typeof LoginFormSchema>) {
  const result = LoginFormSchema.safeParse(data);
  if (!result.success) {
    return { failure: { error: "Invalid form data" } };
  }
  const { email, password } = data;
  try {
    const user = await findUserByEmail(email);
    if (!user)
      return { failure: { error: "No account found with this email address" } };
    if (!user.hashedPassword) {
      return {
        failure: {
          error:
            "This account was created with different method. This could me a customer's account.",
        },
      };
    }
    const passwordsMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordsMatch)
      return {
        failure: { error: "Incorrect password" },
      };
    await createSession({
      id: user.id,
      email: user.email!,
      name: user.name!,
      role: user.role,
    });
    return { success: { message: "Logged in successfuly" } };
  } catch (error) {
    console.log("Something went wrong");
  }
}
