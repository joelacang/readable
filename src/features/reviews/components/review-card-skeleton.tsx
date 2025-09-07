import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

interface Props {
  mode?: "user" | "book";
  hideHelpfulBar?: boolean;
}
const ReviewCardSkeleton = ({
  mode = "book",
  hideHelpfulBar = false,
}: Props) => {
  return (
    <Card className="border-l-primary/20 border-l-4 p-0">
      <CardContent className="p-0">
        <div className="w-full">
          <div className="space-y-6 p-4">
            {/* Review Header */}
            {mode === "book" && (
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-full" />
                  <div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3.5 w-16" />
                    </div>
                  </div>
                </div>
                <Skeleton className="size-8" />
              </div>
            )}

            {/* TODO: EDIT LATER */}
            {/* {mode === "user"  && (
              <div className="flex gap-4">
                <Skeleton className="size-12" />
                <div className="space-y-0">
                  <Link
                    href={`/books/${review.book.details?.slug}`}
                    className={cn(
                      buttonVariants({ variant: "link" }),
                      "size-fit p-0 font-mono text-lg leading-none font-semibold",
                    )}
                  >
                    {review.book.details?.title}
                  </Link>

                  <div className="flex items-center gap-4">
                    {review.book.details?.authors.map((author) => (
                      <span
                        className={cn(
                          buttonVariants({ variant: "link", size: "sm" }),
                          "size-fit p-0",
                        )}
                        key={author.id}
                      >
                        {author.name}
                      </span>
                    ))}
                    <span className="bg-muted text-muted-foreground px-2 py-0 text-xs font-semibold">
                      {review.book.format}
                    </span>
                  </div>
                </div>
              </div>
            )} */}

            {/* TODO : EDIT LATER */}
            {/* Review Content */}
            {/* <div className="mb-2 lg:px-4">
              {mode === "user" && (
                <div className="space-y-1 pb-4">
                  <div className="flex items-center gap-4">
                    <p className="font-mono text-sm">Rating:</p>
                    <StarRating compact value={review.rating} disabled />
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-mono text-sm">
                      Date Reviewed:&nbsp;&nbsp;
                      <span className="text-muted-foreground font-medium">
                        {review.dateReviewed.toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                </div>
              )} */}

            {/* TODO: ADD CONTAINING SPOILERS */}
            {/* {review.spoilerWarning && (
              <Badge variant="destructive" className="mb-2">
                Contains Spoilers
              </Badge>
            )} */}
            <div className="space-y-3">
              <Skeleton className="h-5 w-2/3" />
              <div className="space-y-1.5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Review Actions */}
        {hideHelpfulBar && (
          <div className="flex items-center gap-4 border-t p-4">
            <Skeleton className="h-5 w-28" />
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Skeleton className="size-4 rounded-full" />
                <Skeleton className="size-4 rounded-none" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="size-4 rounded-full" />
                <Skeleton className="size-4 rounded-none" />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewCardSkeleton;
