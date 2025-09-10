import { createContext, useContext, useState } from "react";
import SearchBar from "~/features/form/components/searchbar";

type SearchContextType = {
  searchValue: string;
  showResults: boolean;
  setSearchValue: (text: string) => void;
  onClear: () => void;
  setShowResults: (show: boolean) => void;
};

const SearchContext = createContext<SearchContextType | null>(null);

export const useSearch = () => {
  const ctx = useContext(SearchContext);

  if (!ctx) throw new Error("useSearch must be used within SearchProvider");

  return ctx;
};

interface Props {
  children: React.ReactNode;
}

export const SearchProvider = ({ children }: Props) => {
  const [searchValue, setSearchValue] = useState("");
  const [showResults, setShowResults] = useState(false);

  const onClear = () => {
    setShowResults(false);
    setSearchValue("");
  };

  return (
    <SearchContext.Provider
      value={{
        searchValue,
        showResults,
        setSearchValue,
        setShowResults,
        onClear,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
