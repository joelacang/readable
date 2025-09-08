import { create } from "zustand";

type OrgFormDialogState = {
  open: boolean;
  isPending: boolean;
  onOpen: () => void;
  onClose: () => void;
  onPending: () => void;
  onCompleted: () => void;
};

export const useOrgFormDialog = create<OrgFormDialogState>((set) => ({
  open: false,
  isPending: false,
  onOpen: () => set({ open: true }),
  onClose: () => set({ open: false }),
  onPending: () => set({ isPending: true }),
  onCompleted: () => set({ isPending: false }),
}));
