import { OrganizationType } from "@prisma/client";
import z from "zod";
import { addressSchema, phoneValidation } from "./contact";

export const createOrgSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: phoneValidation,
  type: z.nativeEnum(OrganizationType),
  description: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  phoneAlt: phoneValidation.optional(),
  address: addressSchema.optional(),
  contactIds: z.array(z.string().cuid()),
});

export type CreateOrgFormType = z.infer<typeof createOrgSchema>;
