import { create } from "zustand";
import type { BookPreviewType } from "~/types/book";

type AddToCardDialogState = {
  open: boolean;
  quantity: number;
  book: BookPreviewType | null;
  onOpen: () => void;
  onAddBook: (book: BookPreviewType) => void;
  onClose: () => void;
  isPending: boolean;
  onPending: () => void;
  onCompleted: () => void;
};

export const useAddToCartDialog = create<AddToCardDialogState>((set) => ({
  open: false,
  quantity: 0,
  book: null,
  isPending: false,
  onOpen: () => set({ open: true }),
  onAddBook: (book) => set({ open: true, book }),
  onClose: () => set({ open: false, book: null, quantity: 0 }),
  onPending: () => set({ isPending: true }),
  onCompleted: () => set({ isPending: false }),
}));
