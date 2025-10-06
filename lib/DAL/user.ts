import { prisma } from "../prisma";
import { User } from "@prisma/client";

export async function createNewUser(data: Partial<User>) {
  const user = await prisma.user.create({
    data,
  });
  return user;
}

export async function findUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return user;
}
