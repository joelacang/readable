"use client";

import { api } from "~/trpc/react";
import Loading from "~/components/loading";
import MessageBox from "~/components/message-box";
import { SearchXIcon, TriangleAlertIcon } from "lucide-react";
import { ModeType } from "~/types/component";
import Centered from "~/features/page/components/centered";
import BookAdmin from "./admin/home-page";
import { usePathname } from "next/navigation";
import BookDetailSection from "./book-detail";

interface Props {
  slug: string;
}
const BookLoaderBySlug = ({ slug }: Props) => {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith(`/admin`);
  const {
    data: book,
    isLoading,
    isError,
    error,
  } = api.book.getBookDetailBySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <Centered>
        <Loading label="Loading Book Details..." />
      </Centered>
    );
  }

  if (isError) {
    return (
      <Centered>
        <MessageBox
          title="Error loading book."
          description={error.message}
          icon={TriangleAlertIcon}
          mode={ModeType.ERROR}
        />
      </Centered>
    );
  }

  if (!book) {
    return (
      <Centered>
        <MessageBox
          title="No Book Found"
          description={`No Book Found. Please try again.`}
          icon={SearchXIcon}
          mode={ModeType.DEFAULT}
        />
      </Centered>
    );
  }

  return (
    <>
      {isAdmin ? <BookAdmin book={book} /> : <BookDetailSection book={book} />}
    </>
  );
};

export default BookLoaderBySlug;
