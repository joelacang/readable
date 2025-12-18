import { create } from "zustand";
import type { OrderItemType } from "~/types/order";

type ReviewDialogState = {
  orderItem: OrderItemType | null;
  open: boolean;
  onOpen: (orderItem: OrderItemType) => void;
  onClose: () => void;
};

export const useReviewDialog = create<ReviewDialogState>((set) => ({
  orderItem: null,
  open: false,
  onOpen: (orderItem) =>
    set({
      orderItem,
      open: true,
    }),
  onClose: () => set({ orderItem: null, open: false }),
}));
