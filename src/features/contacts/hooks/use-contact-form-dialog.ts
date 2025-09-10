import { create } from "zustand";
import type { ContactType } from "~/zod-schemas/contact";

type ContactFormDialogState = {
  open: boolean;
  isPending: boolean;
  orgTempId: string | null;
  addedContact: ContactType | null;
  canAddContactToOrg: boolean;
  onOpen: () => void;
  onClose: () => void;
  onPending: () => void;
  onCompleted: () => void;
  onOpenOrgContact: (orgTempId: string) => void;
  onReset: () => void;
  onContactAdded: (contact: ContactType) => void;
  onRemoveContact: () => void;
};

export const useContactFormDialog = create<ContactFormDialogState>((set) => ({
  open: false,
  isPending: false,
  orgTempId: null,
  addedContact: null,
  canAddContactToOrg: false,
  onOpen: () => set({ open: true }),
  onClose: () => set({ open: false }),
  onPending: () => set({ isPending: true }),
  onCompleted: () => set({ isPending: false }),
  onOpenOrgContact: (orgTempId) =>
    set({ orgTempId, open: true, canAddContactToOrg: true }),
  onReset: () =>
    set({
      open: false,
      isPending: false,
      orgTempId: null,
      canAddContactToOrg: false,
    }),
  onContactAdded: (contact) =>
    set({ addedContact: contact, canAddContactToOrg: false }),
  onRemoveContact: () => set({ addedContact: null }),
}));
