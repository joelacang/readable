import type { BookSummaryType } from "./book";

export type WishListItemType = {
  id: string;
  book: BookSummaryType;
  dateAdded: Date;
};
