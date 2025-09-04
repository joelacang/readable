import type { LucideIcon } from "lucide-react";
import { create } from "zustand";

type ConfirmAlertFormType = {
  title: string;
  message: string;
  icon: LucideIcon;
  mode: "default" | "destructive";
  enableConfirmation: boolean;
  action: () => void;
  actionLabel?: string;
  cancelLabel?: string;
  children?: () => React.ReactNode;
};

type ConfirmDialogState = {
  confirmDetails: ConfirmAlertFormType | null;
  open: boolean;
  confirmCode: string | null;
  error: string | null;
  isError: boolean;
  isPending: boolean;
  isCompleted: boolean;
  onOpen: (details: ConfirmAlertFormType) => void;
  onClose: () => void;
  onValidate: (code?: string | null) => boolean;
  onConfirm: () => boolean;
  onError: (error: string | null) => void;
  onPending: () => void;
  onCompleted: () => void;
  onReset: () => void;
};

export const useConfirmationAlert = create<ConfirmDialogState>((set) => ({
  confirmDetails: null,
  open: false,
  confirmCode: null,
  error: null,
  isError: false,
  isPending: false,
  isCompleted: false,
  onOpen: (confirmDetails) => {
    const confirmCode = confirmDetails.enableConfirmation
      ? Math.floor(100000 + Math.random() * 900000).toString()
      : null;
    set({ confirmDetails, open: true, confirmCode });
  },
  onClose: () =>
    set({
      confirmDetails: null,
      open: false,
      error: null,
      isError: false,
      isPending: false,
      confirmCode: null,
      isCompleted: false,
    }),
  onValidate: (code) => {
    const state = useConfirmationAlert.getState();

    // Check if confirmation is required and validate code
    if (state.confirmDetails?.enableConfirmation) {
      if (!code || code !== state.confirmCode) {
        return false;
      }
    }

    return true;
  },
  onConfirm: () => {
    const state = useConfirmationAlert.getState();

    if (!state.confirmDetails?.action) return false;

    try {
      state.confirmDetails.action();

      return true;
    } catch (error) {
      console.error(error);
      set({
        isError: true,
        error: "An error occurred. Please try again.",
      });
      return false;
    }
  },
  onError: (error) => set({ isError: true, error }),
  onPending: () => set({ isPending: true }),
  onCompleted: () =>
    set({
      isPending: false,
      isCompleted: true,
      open: false,
    }),
  onReset: () =>
    set({
      isPending: false,
      isCompleted: false,
      open: false,
      confirmDetails: null,
      error: null,
      isError: false,
      confirmCode: null,
    }),
}));
