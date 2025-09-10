import { create } from "zustand";
import type { BookPreview } from "~/types/book";

type BookPaginationState = {
  books: BookPreview[];
  currentPage: number;
  isLoadingFirstPage: boolean;
  isLoadingMore: boolean;
  isLastPage: boolean;
  limit: number;

  onLoadFirstPage: () => void;
  onLoadNextPage: () => void;
  onSetLimit: (limit: number) => void;
  onStopLoadingFirstPage: () => void;
  onStopLoadingMore: () => void;
  onAddBooks: (books: BookPreview[]) => void;
  onSetLastPage: () => void;
  onReset: () => void;
  onDeleteBook: (bookId: string) => void;
};

export const useBookPagination = create<BookPaginationState>((set) => ({
  books: [],
  currentPage: 1,
  isLoadingFirstPage: false,
  isLoadingMore: false,
  isLastPage: false,
  limit: 5,
  bookIdToDelete: null,
  onLoadFirstPage: () =>
    set({
      isLoadingFirstPage: true,
      isLoadingMore: false,
      currentPage: 1,
      books: [],
      isLastPage: false,
    }),

  onLoadNextPage: () =>
    set((state) => ({
      isLoadingMore: true,
      currentPage: state.currentPage + 1,
    })),

  onStopLoadingFirstPage: () => set({ isLoadingFirstPage: false }),

  onStopLoadingMore: () => set({ isLoadingMore: false }),

  onAddBooks: (newBooks) =>
    set((state) => {
      const merged = [...state.books];
      newBooks.forEach((book) => {
        if (!merged.some((b) => b.id === book.id)) {
          merged.push(book);
        }
      });

      return { books: merged };
    }),
  onSetLimit: (limit) => set({ limit }),
  onSetLastPage: () => set({ isLastPage: true }),

  onReset: () =>
    set({
      books: [],
      currentPage: 1,
      isLoadingFirstPage: false,
      isLoadingMore: false,
      isLastPage: false,
    }),

  onDeleteBook: (bookId) =>
    set((state) => ({
      books: state.books.filter((book) => book.id !== bookId),
    })),
}));
