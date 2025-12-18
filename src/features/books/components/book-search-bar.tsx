import SearchBar from "~/features/form/components/searchbar";
import { SearchProvider } from "~/providers/search-provider";
import BookSearchResults from "./book-search-results";

const BookSearchBar = () => {
  return (
    <SearchProvider>
      <SearchBar placeholder="Enter Book Name To Search">
        <BookSearchResults />
      </SearchBar>
    </SearchProvider>
  );
};

export default BookSearchBar;
