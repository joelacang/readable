import { create } from "zustand";
import type { ContactType } from "~/zod-schemas/contact";

type ContactDetailDialogState = {
  open: boolean;
  contact: ContactType | null;
  onOpen: (contact: ContactType) => void;
  onClose: () => void;
};

export const useContactDetailDialog = create<ContactDetailDialogState>(
  (set) => ({
    open: false,
    contact: null,
    onOpen: (contact) => set({ open: true, contact }),
    onClose: () => set({ contact: null, open: false }),
  }),
);
