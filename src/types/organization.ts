import type { OrganizationType } from "@prisma/client";
import type { AddressType } from "./order";
import type { ContactType } from "~/zod-schemas/contact";

export type OrganizationDetailType = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: OrganizationType;
  phoneAlt?: string | null;
  website?: string | null;
  description?: string | null;
  address: AddressType | null;
  contactPersons: ContactType[];
};
