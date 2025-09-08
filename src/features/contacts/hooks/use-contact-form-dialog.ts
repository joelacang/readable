import { create } from "zustand";

type ContactFormDialogState = {
  open: boolean;
  isPending: boolean;
  orgTempId: string | null;
  onOpen: () => void;
  onClose: () => void;
  onPending: () => void;
  onCompleted: () => void;
  onOpenOrgContact: (orgTempId: string) => void;
  onReset: () => void;
};

export const useContactFormDialog = create<ContactFormDialogState>((set) => ({
  open: false,
  isPending: false,
  orgTempId: null,
  onOpen: () => set({ open: true }),
  onClose: () => set({ open: false }),
  onPending: () => set({ isPending: true }),
  onCompleted: () => set({ isPending: false }),
  onOpenOrgContact: (orgTempId) => set({ orgTempId, open: true }),
  onReset: () => set({ open: false, isPending: false, orgTempId: null }),
}));
