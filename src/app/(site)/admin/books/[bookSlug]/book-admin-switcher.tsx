import BookDetails from "~/features/books/components/admin/book-details";
import BookOrders from "~/features/books/components/admin/book-orders";
import { useBook } from "~/providers/book-provider";
import { AdminView } from "~/types/book";

const BookAdminSwitcher = () => {
  const { view, book } = useBook();

  switch (view) {
    case AdminView.ORDERS:
      return <BookOrders bookId={book.id} />;
    case AdminView.DETAILS:
      return <BookDetails />;
    default:
      return <p>Still working on this view: {view}</p>;
  }
};

export default BookAdminSwitcher;
