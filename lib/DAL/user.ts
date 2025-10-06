import { prisma } from "../prisma";
import { User } from "@prisma/client";

export async function createNewUser(data: Partial<User>) {
  const user = await prisma.user.create({
    data,
  });
  return user;
}
