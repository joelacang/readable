import type { BookFormat, ReviewStatus } from "@prisma/client";
import type { BookSummary } from "./book";
import type { OrderItemType } from "./order";
import type { UserType } from "./users";

export type ReviewDetailType = {
  id: string;
  title?: string | null;
  content: string | null;
  rating: number;
  reviewer: UserType | null;
  dateReviewed: Date;
  bookId: string | null;
  status: ReviewStatus;
  orderItemId: string | null;
  book?: { details: BookSummary | null; format: BookFormat | null } | null;
};
