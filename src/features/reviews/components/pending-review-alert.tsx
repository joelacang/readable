"use client";

import { useRouter } from "next/navigation";
import { QueryStateHandler } from "~/components/query-state-handler";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

const PendingReviewAlert = () => {
  const {
    data: count,
    isLoading,
    isError,
    error,
  } = api.review.getPendingReviewsCount.useQuery();
  const router = useRouter();

  return (
    <QueryStateHandler
      data={count}
      isLoading={isLoading}
      isError={isError}
      loadingLabel={null}
      errorTitle={""}
      errorMessage={error?.message ?? "Error getting pending reviews."}
    >
      {(count) => (
        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
          <p className="text-muted-foreground font-mono text-sm">
            You have <span className="text-primary font-semibold">{count}</span>
            &nbsp; pending reviews from your orders.
          </p>
          <Button onClick={() => router.push(`/user/reviews/pending`)}>
            Check Here
          </Button>
        </div>
      )}
    </QueryStateHandler>
  );
};

export default PendingReviewAlert;
