import { isPageStatic } from "next/dist/build/utils";
import { create } from "zustand";
import type { FormIdentityType } from "~/types/component";
import type { UserPreviewType } from "~/types/users";

type AuthorFormDialogState = {
  open: boolean;
  authorCreated: UserPreviewType | null;
  onOpen: () => void;
  onClose: () => void;
  onAuthorCreated: (author: UserPreviewType) => void;
  onOpenWithName: (name: string) => void;
  pendingName: string | null;
  mode: "create" | "edit" | "saved";
  onChangeMode: (mode: "create" | "edit" | "saved") => void;
  reset: () => void;
  isValid: boolean;
  onFormValidated: () => void;
  isPending: boolean;
  onFormPending: () => void;
  onFormRequestCompleted: () => void;
  authorOptionCreated: FormIdentityType | null;
  onCreateAuthorOption: (option: FormIdentityType) => void;
  removeOption: () => void;
  skipConfirm: boolean;
};

export const useAuthorFormDialog = create<AuthorFormDialogState>((set) => ({
  open: false,
  authorCreated: null,
  authorOptionCreated: null,
  pendingName: null,
  mode: "create",
  isValid: false,
  isPending: false,
  skipConfirm: false,
  onOpen: () => set({ open: true }),
  onClose: () =>
    set({
      open: false,
      authorCreated: null,
      mode: "create",
      isValid: false,
      isPending: false,
      pendingName: null,
      skipConfirm: false,
    }),
  onOpenWithName: (pendingName) =>
    set({ pendingName, open: true, skipConfirm: true }),
  onAuthorCreated: (author) =>
    set({ authorCreated: author, mode: "saved", isPending: false }),
  onChangeMode: (mode) => set({ mode }),
  onCreateAuthorOption: (option) => set({ authorOptionCreated: option }),
  reset: () =>
    set({
      authorCreated: null,
      mode: "create",
      isValid: false,
      isPending: false,
      pendingName: null,
      skipConfirm: false,
    }),
  onFormValidated: () => set({ isValid: true }),
  onFormPending: () => set({ isPending: true }),
  removeOption: () => set({ authorOptionCreated: null }),
  onFormRequestCompleted: () => set({ isPending: false }),
}));
