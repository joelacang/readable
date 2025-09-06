import BookReviewList from "~/features/reviews/components/book-review-list";
import ReviewSummary from "~/features/reviews/components/review-summary";

interface Props {
  bookId: string;
}
const BookReviews = ({ bookId }: Props) => {
  return (
    <div className="w-full">
      <ReviewSummary />
      <div className="py-8">
        <BookReviewList bookId={bookId} compact />
      </div>
    </div>
  );
};

export default BookReviews;
