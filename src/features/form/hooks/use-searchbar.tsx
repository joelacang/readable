import { create } from "zustand";

type SearchBarState = {
  searchValue: string;
  showSearchResults: boolean;
  onChangeValue: (text: string) => void;
  onClear: () => void;
  onShowResults: () => void;
  onHideResults: () => void;
};

export const useSearchBar = create<SearchBarState>((set) => ({
  searchValue: "",
  showSearchResults: false,
  onChangeValue: (searchValue) => set({ searchValue }),
  onClear: () => set({ searchValue: "", showSearchResults: false }),
  onShowResults: () => set({ showSearchResults: true }),
  onHideResults: () => set({ showSearchResults: false }),
}));
