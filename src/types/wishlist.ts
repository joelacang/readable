import type { BookSummary } from "./book";

export type WishListItemType = {
  id: string;
  book: BookSummary;
  dateAdded: Date;
};
