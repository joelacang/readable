"use client";

import { useParams } from "next/navigation";
import type React from "react";
import { createContext, useContext, useState } from "react";
import { QueryStateHandler } from "~/components/query-state-handler";
import { api } from "~/trpc/react";
import { AdminView, type BookDetail } from "~/types/book";

type BookContextType = {
  book: BookDetail;
  currentOrderRef: string | null;
  setCurrentOrderRef: (ref: string | null) => void;
  view: AdminView;
  setView: (view: AdminView) => void;
};

const BookContext = createContext<BookContextType | null>(null);

export const useBook = () => {
  const ctx = useContext(BookContext);

  if (!ctx) throw new Error("useBook must be used within BookProvider.");

  return ctx;
};

interface Props {
  children: React.ReactNode;
}

export const BookProvider = ({ children }: Props) => {
  const params = useParams();
  const bookSlug = params?.bookSlug as string;
  const [view, setView] = useState<AdminView>(AdminView.OVERVIEW);

  const handleSetView = (view: AdminView) => {
    setView(view);
  };
  const {
    data: book,
    isLoading,
    isError,
    error,
  } = api.book.getBookDetailBySlug.useQuery(
    { slug: bookSlug },
    { enabled: !!bookSlug },
  );

  const [currentOrderRef, setCurrentOrderRef] = useState<string | null>(null);

  return (
    <QueryStateHandler
      isLoading={isLoading}
      isError={isError}
      errorMessage={error?.message ?? "An unknown error occurred."}
      data={book}
      loadingLabel="Loading Book Details..."
      emptyTitle="No Book Found"
      emptyDescription={`No Book Found for: ${bookSlug}`}
    >
      {(book) => (
        <BookContext.Provider
          value={{
            currentOrderRef,
            setCurrentOrderRef,
            book,
            view,
            setView: handleSetView,
          }}
        >
          {children}
        </BookContext.Provider>
      )}
    </QueryStateHandler>
  );
};
