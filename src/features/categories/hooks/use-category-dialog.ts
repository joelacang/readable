import { create } from "zustand";
import type { CategoryDetailType } from "~/types/categories";
import type { FormIdentityType } from "~/types/component";

type CategoryDialogState = {
  parentId: string | null;
  open: boolean;
  name: string | null;
  parentCategory: CategoryDetailType | null;
  createdCategoryOption: FormIdentityType | null;
  currentCategory: CategoryDetailType | null;
  createOption: boolean;
  onOpen: () => void;
  onOpenSub: (parentCategory: CategoryDetailType) => void;
  onOpenName: (name: string) => void;
  onCreateCategoryOption: (option: FormIdentityType) => void;
  onEditCategory: (category: CategoryDetailType) => void;
  onClose: () => void;
  removeCreatedCategory: () => void;
};

export const useCategoryDialog = create<CategoryDialogState>((set) => ({
  open: false,
  parentId: null,
  name: null,
  createdCategoryOption: null,
  parentCategory: null,
  createOption: false,
  currentCategory: null,
  onOpen: () => set({ open: true }),
  onOpenSub: (parentCategory) => set({ open: true, parentCategory }),
  onOpenName: (name) => set({ name, open: true, createOption: true }),
  onCreateCategoryOption: (category) =>
    set({ createdCategoryOption: category }),
  onEditCategory: (currentCategory) => set({ currentCategory, open: true }),
  onClose: () =>
    set({
      open: false,
      parentId: null,
      name: null,
      createOption: false,
      currentCategory: null,
    }),
  removeCreatedCategory: () => set({ createdCategoryOption: null }),
}));
