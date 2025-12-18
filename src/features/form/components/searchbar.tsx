/* eslint-disable react-hooks/exhaustive-deps */
import { SearchIcon } from "lucide-react";
import { useEffect, useRef, useState, type HTMLProps } from "react";
import InputIcon from "~/components/input-icon";
import { useDebounced } from "~/hooks/use-debounced";
import CloseButton from "~/components/close-button";
import { useSearch } from "~/providers/search-provider";

interface Props extends HTMLProps<HTMLInputElement> {
  children: React.ReactNode;
}
const SearchBar = ({ children, ...props }: Props) => {
  const [searchText, setSearchText] = useState("");
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const debouncedText = useDebounced(searchText.trim(), 500);
  const { searchValue, setSearchValue, setShowResults, showResults, onClear } =
    useSearch();

  useEffect(() => {
    if (debouncedText) {
      setShowResults(true);
      setSearchValue(debouncedText);
    }
  }, [debouncedText]);

  useEffect(() => {
    if (searchValue === "") {
      setSearchText("");
    }
  }, [searchValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full">
      <div className="relative">
        <InputIcon
          icon={SearchIcon}
          placeholder="Enter To Search"
          value={searchText}
          onChange={(e) => setSearchText(e.currentTarget.value)}
          {...props}
          onClick={() => {
            if (searchValue && !showResults) {
              setShowResults(true);
            }
          }}
        />
        {searchValue && (
          <CloseButton
            className="absolute top-1 right-2"
            onClose={() => {
              onClear();
              setSearchText("");
            }}
          />
        )}
      </div>

      {searchValue && showResults && (
        <div
          className="absolute top-full z-10 mt-1 w-full"
          ref={searchResultsRef}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
