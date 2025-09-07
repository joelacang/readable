import { Skeleton } from "~/components/ui/skeleton";

const ReviewSummarySkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-8 px-4 py-8 md:grid-cols-2 lg:px-8">
      <div className="flex items-center justify-center">
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center gap-1">
            <Skeleton className="size-10 rounded-lg" />
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-44" />
            {/* <div className="text-muted-foreground mt-1 text-sm">
              Based on {stats.totalRatings} reviews
            </div> */}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-row items-center justify-between gap-8"
          >
            <Skeleton className="h-5 w-8" />
            <div className="w-full">
              <Skeleton className="h-2 w-full" />
            </div>
            <Skeleton className="h-5 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSummarySkeleton;
