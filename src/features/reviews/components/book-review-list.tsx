import { QueryStateHandler } from "~/components/query-state-handler";
import { api } from "~/trpc/react";
import ReviewCard from "./review-card";
import ReviewCardSkeleton from "./review-card-skeleton";

interface Props {
  bookId: string;
  compact?: boolean;
}
const BookReviewList = ({ bookId, compact }: Props) => {
  const {
    data: reviews,
    isLoading,
    isError,
    error,
  } = api.review.getReviewsByBookId.useQuery({ bookId });

  return (
    <QueryStateHandler
      data={reviews}
      isLoading={isLoading}
      isError={isError}
      loadingLabel={<ReviewCardSkeleton />}
      errorTitle="Error Loading Reviews"
      errorMessage={error?.message ?? "Unknown Error Occurred."}
      emptyTitle="No Reviews Found"
      emptyDescription="No Reviews Found for this book."
    >
      {(reviews) => (
        <div className="w-full space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              hideHelpfulBar={compact}
              mode="book"
            />
          ))}
        </div>
      )}
    </QueryStateHandler>
  );
};

export default BookReviewList;
