"use client";

import { TriangleAlertIcon } from "lucide-react";
import MessageBox from "~/components/message-box";
import { api } from "~/trpc/react";
import { ConfirmationType } from "~/types/component";
import BookListItem from "./book-list-item";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import Loading from "~/components/loading";
import { useBookPagination } from "../hooks/use-book-pagination";
import { usePathname, useSearchParams } from "next/navigation";
import BookListItemSkeleton from "./book-list-item-skeleton";
import { Skeleton } from "~/components/ui/skeleton";

interface Props {
  catIdProp?: string;
}

const BookList = ({ catIdProp }: Props) => {
  const searchParams = useSearchParams();
  const catIdParam = searchParams.get("categoryId");
  const [totalBooks, setTotalBooks] = useState(0);
  const pathname = usePathname();

  const categoryId = catIdProp ?? catIdParam;

  const {
    books,
    currentPage,
    isLoadingFirstPage,
    isLoadingMore,
    isLastPage,
    onLoadFirstPage,
    onLoadNextPage,
    onStopLoadingFirstPage,
    onStopLoadingMore,
    onAddBooks,
    onSetLastPage,
    limit,
  } = useBookPagination(); // subscribe to all needed state/actions

  const input = {
    page: currentPage,
    limit,
    categoryId,
  };

  const { data, isLoading, isError, error } = api.book.getBookPreviews.useQuery(
    input,
    {
      enabled: !isLastPage,
      staleTime: 5 * 60 * 1000,
    },
  );

  // Initial load or next page fetch
  useEffect(() => {
    if (isLoading) {
      if (currentPage === 1) {
        onLoadFirstPage();
      }
    }
  }, [isLoading, currentPage, onLoadFirstPage]);

  useEffect(() => {
    onLoadFirstPage();
    setTotalBooks(0);
  }, [categoryId, onLoadFirstPage]);

  useEffect(() => {
    if (!data) return;

    onAddBooks(data.books);
    setTotalBooks(data.totalCount);
    const totalPages = Math.ceil(data.totalCount / limit);
    if (currentPage >= totalPages) {
      onSetLastPage();
    }

    if (currentPage === 1) {
      onStopLoadingFirstPage();
    } else {
      onStopLoadingMore();
    }
  }, [
    data,
    currentPage,
    limit,
    onAddBooks,
    onSetLastPage,
    onStopLoadingFirstPage,
    onStopLoadingMore,
  ]);

  // Handle loading/error/empty states
  if (isLoadingFirstPage) {
    return (
      <div>
        <div className="py-4">
          <Skeleton className="h-7 w-64" />
        </div>
        <BookListItemSkeleton />
        <BookListItemSkeleton />
        <BookListItemSkeleton />
        <BookListItemSkeleton />
        <BookListItemSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <MessageBox
        title="Error Loading Books"
        description={error.message}
        icon={TriangleAlertIcon}
        mode={ConfirmationType.ERROR}
      />
    );
  }

  if (books.length === 0 && !isLoading) {
    return (
      <div className="py-8">
        <MessageBox
          title="No Books Found"
          description={`No Books Found ${data?.categoryName && " for the category: '" + data.categoryName}' .`}
          icon={TriangleAlertIcon}
          mode={ConfirmationType.DEFAULT}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!isLoadingMore && (
        <div className="mt-4 text-sm text-gray-700">
          <p>
            <span className="font-medium">{books.length}</span>
            {data?.totalCount && data.totalCount > books.length && (
              <span className="text-gray-500"> of {totalBooks}</span>
            )}
            <span className="ml-1">Books found</span>
            {data?.categoryName && (
              <>
                <span className="ml-1">for category:</span>
                <span className="text-primary ml-1 font-semibold">
                  {data.categoryName}
                </span>
              </>
            )}
            .
          </p>
        </div>
      )}

      <div>
        {books.map((book) => (
          <BookListItem
            key={`${book.id}${book.wishlistId ? "-" + book.wishlistId : ""}`}
            book={book}
            isAdmin={pathname.startsWith(`/admin`)}
          />
        ))}
      </div>

      {isLoadingMore && <Loading label="Loading More Books" />}
      {!isLoading && !isLastPage && !isLoadingMore && (
        <div className="flex w-full items-center justify-center">
          <Button
            variant="outline"
            className="text-primary hover:text-primary"
            onClick={onLoadNextPage}
          >
            Load More Books
          </Button>
        </div>
      )}
      {isLastPage && (
        <div className="flex w-full items-center justify-center pt-2">
          <p className="text-primary text-xs font-light">
            This is the end of this list.
          </p>
        </div>
      )}
    </div>
  );
};

export default BookList;
