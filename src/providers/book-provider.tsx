"use client";

import { useParams } from "next/navigation";
import type React from "react";
import { createContext, useContext, useState } from "react";
import { QueryStateHandler } from "~/components/query-state-handler";
import { api } from "~/trpc/react";
import { AdminView, type BookDetailType } from "~/types/book";

type BookContextType = {
  view: AdminView;
  setView: (view: AdminView) => void;
  book: BookDetailType;
  currentOrderRef: string | null;
  setCurrentOrderRef: (ref: string | null) => void;
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

  const {
    data: book,
    isLoading,
    isError,
    error,
  } = api.book.getBookDetailBySlug.useQuery(
    { slug: bookSlug },
    { enabled: !!bookSlug },
  );

  const [view, setView] = useState<AdminView>(AdminView.OVERVIEW);
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
          value={{ view, setView, currentOrderRef, setCurrentOrderRef, book }}
        >
          {children}
        </BookContext.Provider>
      )}
    </QueryStateHandler>
  );
};
