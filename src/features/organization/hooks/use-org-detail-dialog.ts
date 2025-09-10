import { create } from "zustand";
import type { OrganizationDetailType } from "~/types/organization";

type OrgDetailDialogState = {
  open: boolean;
  organization: OrganizationDetailType | null;
  onOpen: (org: OrganizationDetailType) => void;
  onClose: () => void;
};

export const useOrgDetailDialog = create<OrgDetailDialogState>((set) => ({
  open: false,
  organization: null,
  onOpen: (organization) => set({ organization, open: true }),
  onClose: () => set({ organization: null, open: false }),
}));
