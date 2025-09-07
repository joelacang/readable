import BookReviewList from "~/features/reviews/components/book-review-list";
import ReviewCardSkeleton from "~/features/reviews/components/review-card-skeleton";
import ReviewSummary from "~/features/reviews/components/review-summary";

interface Props {
  bookId: string;
}
const BookReviews = ({ bookId }: Props) => {
  return (
    <div className="w-full">
      <ReviewSummary bookId={bookId} />
      <div className="py-8">
        <BookReviewList bookId={bookId} compact />
      </div>
    </div>
  );
};

export default BookReviews;
