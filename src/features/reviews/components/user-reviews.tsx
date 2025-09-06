"use client";

import { QueryStateHandler } from "~/components/query-state-handler";
import { api } from "~/trpc/react";
import ReviewCard from "./review-card";

interface Props {
  userId?: string;
}
const UserReviews = ({ userId }: Props) => {
  const {
    data: reviews,
    isLoading,
    isError,
    error,
  } = api.review.getReviewsByUserId.useQuery({ userId });

  return (
    <QueryStateHandler
      data={reviews}
      isLoading={isLoading}
      isError={isError}
      loadingLabel="Loading Reviews..."
      errorTitle="Error Loading Reviews"
      errorMessage={error?.message ?? "An unknown error occurred."}
      emptyTitle="No Reviews Found"
      emptyDescription="No Reviews Found. Try again later."
    >
      {(reviews) => (
        <div className="w-full space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              mode="user"
              hideHelpfulBar
            />
          ))}
        </div>
      )}
    </QueryStateHandler>
  );
};

export default UserReviews;
