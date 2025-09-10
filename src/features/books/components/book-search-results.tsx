import { QueryStateHandler } from "~/components/query-state-handler";
import { useSearch } from "~/providers/search-provider";
import { api } from "~/trpc/react";
import BookSearchResult from "./book-search-result";

const BookSearchResults = () => {
  const { searchValue } = useSearch();
  const {
    data: books,
    isLoading,
    isError,
    error,
  } = api.book.searchBook.useQuery({ searchValue }, { enabled: !!searchValue });

  return (
    <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
      <QueryStateHandler
        data={books}
        isLoading={isLoading}
        isError={isError}
        loadingLabel={`Searching for books: ${searchValue}`}
        errorTitle={`Error Searching Books`}
        errorMessage={error?.message}
      >
        {(books) => (
          <div className="py-2">
            <p className="px-4 py-2 font-mono text-sm font-medium">
              <span className="text-primary font-semibold">{books.length}</span>
              &nbsp; Results for&nbsp;
              <span className="text-primary font-semibold">
                &apos;{searchValue}&apos;:
              </span>
            </p>
            {books.map((book) => (
              <BookSearchResult key={book.id} book={book} />
            ))}
          </div>
        )}
      </QueryStateHandler>
    </div>
  );
};

export default BookSearchResults;
