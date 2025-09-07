import { QueryStateHandler } from "~/components/query-state-handler";
import { StarRating } from "~/components/star-rating";
import { Progress } from "~/components/ui/progress";
import { api } from "~/trpc/react";
import ReviewSummarySkeleton from "./review-summary-skeleton";

interface Props {
  bookId: string;
}
const ReviewSummary = ({ bookId }: Props) => {
  const {
    data: stats,
    isLoading,
    isError,
    error,
  } = api.review.getReviewStats.useQuery({ bookId });

  return (
    <QueryStateHandler
      data={stats}
      isLoading={isLoading}
      isError={isError}
      errorTitle="Error Loading Rating Stats."
      errorMessage={error?.message ?? "An unknown error occurred."}
      loadingLabel={<ReviewSummarySkeleton />}
      emptyTitle="No Stats found"
      emptyDescription={`No stats found for bookId: ${bookId}`}
    >
      {(stats) => (
        <>
          <div className="grid grid-cols-1 gap-8 px-4 py-8 md:grid-cols-2 lg:px-8">
            <div className="flex items-center justify-center">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold">
                    {stats.averageRating}
                  </div>
                  <div className="mt-1 flex items-center justify-center gap-1">
                    <StarRating
                      value={Math.round(stats.averageRating)}
                      disabled
                    />
                  </div>
                  <div className="text-muted-foreground mt-1 text-sm">
                    Based on {stats.totalRatings} reviews
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {stats.ratingsBreakdown.map((rating) => (
                <div
                  key={rating.stars}
                  className="flex items-center gap-2 text-sm"
                >
                  <span className="w-10 text-left">{rating.stars}★</span>
                  <Progress value={rating.percent} className="h-2 flex-1" />
                  <span className="text-muted-foreground w-10 text-right">
                    {rating.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </QueryStateHandler>
  );
};

export default ReviewSummary;
