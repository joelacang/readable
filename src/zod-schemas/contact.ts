import { ContactRole } from "@prisma/client";
import z from "zod";
import type { AddressType } from "~/types/order";

export const phoneValidation = z
  .string()
  .min(7, "Phone number is too short")
  .max(20, "Phone number is too long")
  .regex(
    /^[+]?[\d\s\-()]+$/,
    "Phone number can only contain digits, spaces, dashes, parentheses, and an optional leading +",
  )
  .transform((val) => val.replace(/[^\d+]/g, "")) // keep + and digits
  .refine((val) => /^\+?\d{7,20}$/.test(val), {
    message: "Phone number is invalid after formatting",
  });

export const addressDefaultValues = {
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
};
export const addressSchema = z.object({
  line1: z.string(),
  line2: z.string(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  country: z.string().transform((val) => val.toUpperCase()), // Ensure consistency
});

// --- Contact Schema ---
export const createContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: phoneValidation,
  position: z.string().optional(),
  description: z.string().optional(),
  role: z.nativeEnum(ContactRole),
  address: addressSchema.optional(),
});

export type CreateContactFormType = z.infer<typeof createContactSchema>;
export type ContactAddressType = z.infer<typeof addressSchema>;

export type ContactType = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: ContactRole;
  position?: string | null;
  description?: string | null;
  address?: AddressType | null;
};
