import { SearchXIcon, TriangleAlertIcon } from "lucide-react";
import Loading from "~/components/loading";
import MessageBox from "~/components/message-box";
import BookFormPage from "~/features/books/components/book-form-page";
import Centered from "~/features/page/components/centered";
import { api } from "~/trpc/react";
import { ConfirmationType } from "~/types/component";

interface Props {
  bookId: string;
}
const EditBook = ({ bookId }: Props) => {
  const {
    data: book,
    isLoading,
    isError,
    error,
  } = api.book.getBookDataById.useQuery({ bookId }, { enabled: !!bookId });

  if (isLoading) {
    return (
      <Centered>
        <Loading label="Loading Book..." />
      </Centered>
    );
  }

  if (isError) {
    return (
      <Centered>
        <MessageBox
          title="Error loading book"
          description={error.message}
          mode={ConfirmationType.ERROR}
          icon={TriangleAlertIcon}
        />
      </Centered>
    );
  }

  if (!book) {
    return (
      <Centered>
        <MessageBox
          title="No book found"
          description={`No book found for the id: ${bookId}`}
          mode={ConfirmationType.DEFAULT}
          icon={SearchXIcon}
        />
      </Centered>
    );
  }
  return <BookFormPage mode="edit" book={book} />;
};

export default EditBook;
