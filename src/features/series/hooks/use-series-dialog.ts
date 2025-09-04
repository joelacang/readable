import { create } from "zustand";
import type { FormIdentityType } from "~/types/component";

type SeriesDialogState = {
  open: boolean;
  optionLabel: string | null;
  createdSeries: FormIdentityType | null;
  isValid: boolean;
  isPending: boolean;
  createOption: boolean;
  formId: string | null;
  onOpen: () => void;
  onClose: () => void;
  onOpenOption: (name: string, formId: string) => void;
  onRemoveOption: () => void;
  onCreateSeriesOption: (series: FormIdentityType) => void;
  onFormValidated: () => void;
  onFormPending: () => void;
  onFormRequestCompleted: () => void;
};

export const useSeriesDialog = create<SeriesDialogState>((set) => ({
  open: false,
  optionLabel: null,
  createdSeries: null,
  isValid: false,
  isPending: false,
  createOption: false,
  formId: null,
  onOpen: () => set({ open: true }),
  onClose: () =>
    set({
      open: false,
      optionLabel: null,
      isValid: false,
      isPending: false,
    }),
  onOpenOption: (optionLabel, formId) =>
    set({ open: true, optionLabel, createOption: true, formId }),
  onRemoveOption: () => set({ optionLabel: null, createdSeries: null }),
  onCreateSeriesOption: (createdSeries) => set({ createdSeries }),
  onFormValidated: () => set({ isValid: true }),
  onFormPending: () => set({ isPending: true }),
  onFormRequestCompleted: () => set({ isPending: false }),
}));
