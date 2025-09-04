import { z } from "zod";

export const signUpSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(32, { message: "Name must be at most 32 characters long" })
    .regex(/^[A-Za-z][A-Za-z0-9 .-]*$/, {
      message:
        "Name must start with a letter and contain only letters, spaces, numbers, hyphens, and dots",
    }),
  username: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(32, { message: "Name must be at most 32 characters long" })
    .regex(/^[A-Za-z][A-Za-z0-9.-]*$/, {
      message:
        "Name must start with a letter and contain only letters, numbers, hyphens, and dots",
    }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[a-z]/, { message: "Password must contain a lowercase letter" })
    .regex(/[A-Z]/, { message: "Password must contain an uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain a number" }),
});

export const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address " }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});
