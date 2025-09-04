import { create } from "zustand";

type AuthorDetailState = {
  authorId: string | null;
  open: boolean;
  onOpen: (authorId: string) => void;
  onClose: () => void;
};

export const useAuthorDetail = create<AuthorDetailState>((set) => ({
  open: false,
  authorId: null,
  onOpen: (authorId) => set({ open: true, authorId }),
  onClose: () => set({ open: false, authorId: null }),
}));
