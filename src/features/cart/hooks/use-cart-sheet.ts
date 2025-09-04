import { create } from "zustand";

type CartSheetState = {
  open: boolean;
  isPending: boolean;
  count: number;
  onPending: () => void;
  onCompleted: () => void;
  onOpen: (count?: number) => void;
  onClose: () => void;
};

export const useCartSheet = create<CartSheetState>((set) => ({
  open: false,
  isPending: false,
  count: 0,
  onPending: () => set({ isPending: true }),
  onCompleted: () => set({ isPending: false }),
  onOpen: (count) => set({ open: true, count: count ?? 0 }),
  onClose: () => set({ open: false }),
}));
