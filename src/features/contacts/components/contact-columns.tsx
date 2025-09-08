import type { ColumnDef } from "@tanstack/react-table";
import type { ContactType } from "~/zod-schemas/contact";

const ContactColumns: ColumnDef<ContactType>[] = [];

export default ContactColumns;
