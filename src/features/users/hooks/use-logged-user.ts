import type { UserType } from "~/types/users";
import { create } from "zustand";

type LoggedUserState = {
  loggedUser: UserType | null;
  addLoggedUser: (user: UserType) => void;
  removeLoggedUser: () => void;
  isLoading: boolean;
  onLoading: () => void;
  onFinishedLoading: () => void;
};

export const useLoggedUser = create<LoggedUserState>((set) => ({
  loggedUser: null,
  isLoading: false,
  addLoggedUser: (user) => set({ loggedUser: user }),
  removeLoggedUser: () => set({ loggedUser: null }),
  onLoading: () => set({ isLoading: true }),
  onFinishedLoading: () => set({ isLoading: false }),
}));
