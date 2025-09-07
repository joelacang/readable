"use client";

import BookDetails from "~/features/books/components/admin/book-details";
import BookOrders from "~/features/books/components/admin/book-orders";
import BookReviews from "~/features/books/components/admin/book-reviews";
import { ReviewsCard } from "~/features/reviews/components/book-reviews-card";
import { useBook } from "~/providers/book-provider";
import { AdminView } from "~/types/book";

interface Props {
  view: AdminView;
}
const BookAdminSwitcher = ({ view }: Props) => {
  const { book } = useBook();

  switch (view) {
    case AdminView.ORDERS:
      return <BookOrders bookId={book.id} />;
    case AdminView.DETAILS:
      return <BookDetails />;
    case AdminView.REVIEWS:
      return <BookReviews bookId={book.id} />;
    default:
      return <p>Still working on this view: {view}</p>;
  }
};

export default BookAdminSwitcher;
