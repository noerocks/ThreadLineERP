import { UserRole } from "@prisma/client";
import z from "zod";

export const SessionPayload = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string(),
  role: z.enum(UserRole),
  expiresAt: z.date(),
});

export const RegisterFormSchema = z
  .object({
    name: z.string().min(1, "This field is required").trim(),
    role: z.enum(UserRole, "Please select a role"),
    email: z.email().trim(),
    birthday: z.date({
      error: "Please pick a date",
    }),
    address: z.string().min(1, "This field is required").trim(),
    contactNumber: z.string().min(1, "This field is required").trim(),
    password: z
      .string()
      .min(8, "Minimum 8 characters")
      .regex(/[A-Z]/, "At least one uppercase character")
      .regex(/[a-z]/, "At least one lowercase character")
      .regex(/[0-9]/, "At least one digit")
      .regex(/[^A-Z0-9a-z]/, "At least one special character")
      .trim(),
    confirm: z.string().min(8, "Minimum 8 characters").trim().optional(),
  })
  .refine((data) => data.password === data.confirm, {
    error: "Passwords didn't match",
    path: ["confirm"],
  });

export const LoginFormSchema = z.object({
  email: z.email().trim(),
  password: z.string().min(1, "This field is required"),
});
