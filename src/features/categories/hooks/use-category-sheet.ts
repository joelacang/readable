import { create } from "zustand";

type CategorySheetState = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useCategorySheet = create<CategorySheetState>((set) => ({
  open: false,
  onOpen: () => set({ open: true }),
  onClose: () => set({ open: false }),
}));
