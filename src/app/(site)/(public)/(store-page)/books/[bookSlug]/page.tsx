import BookLoaderBySlug from "~/features/books/components/book-loader-by-slug";

interface Props {
  params: Promise<{ bookSlug: string }>;
}
const BookDetailPage = async ({ params }: Props) => {
  const { bookSlug } = await params;
  return (
    <div>
      <BookLoaderBySlug slug={bookSlug} />
    </div>
  );
};

export default BookDetailPage;
