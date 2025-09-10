import { QueryStateHandler } from "~/components/query-state-handler";
import SearchBar from "~/features/form/components/searchbar";
import { api } from "~/trpc/react";
import BookSearchResult from "./book-search-result";

import { SearchProvider, useSearch } from "~/providers/search-provider";
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
