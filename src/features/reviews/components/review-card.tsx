import {
  ChevronDownIcon,
  ChevronUpIcon,
  FlagIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { StarRating } from "~/components/star-rating";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button, buttonVariants } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import type { ReviewDetailType } from "~/types/review";

interface Props {
  review: ReviewDetailType;
  hideHelpfulBar?: boolean;
  mode?: "user" | "book";
}

const ReviewCard = ({
  review,
  hideHelpfulBar = false,
  mode = "book",
}: Props) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const shouldTruncate = Boolean(review.content && review.content.length > 300);

  return (
    <Card className="border-l-primary/20 border-l-4 p-0">
      <CardContent className="p-0">
        <div className="w-full">
          <div className="space-y-6 p-4">
            {/* Review Header */}
            {mode === "book" && (
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={review.reviewer?.image ?? "/images/placeholder.jpg"}
                    />
                    <AvatarFallback>
                      {review.reviewer?.name?.slice(0, 2).toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {review.reviewer?.name ?? "Unknown User"}
                      </span>
                      {review.orderItemId && (
                        <Badge className="bg-[#e2832c] text-xs">
                          Verified Purchase
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <StarRating value={review.rating} disabled compact />
                      <span className="text-muted-foreground text-xs">
                        {new Date(review.dateReviewed).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <FlagIcon className="h-4 w-4" />
                </Button>
              </div>
            )}

            {mode === "user" && review.book && (
              <div className="flex gap-4">
                {review.book.details?.imagesUrl[0] && (
                  <div className="relative aspect-square size-12">
                    <Image
                      fill
                      src={review.book.details.imagesUrl[0]}
                      alt={`${review.book.details.title} Cover`}
                      className="object-contain"
                    />
                  </div>
                )}
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
            )}

            {/* Review Content */}
            <div className="mb-2 lg:px-4">
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
              )}

              <h4 className="mb-1 font-semibold">{review.title}</h4>
              {/* TODO: ADD CONTAINING SPOILERS */}
              {/* {review.spoilerWarning && (
              <Badge variant="destructive" className="mb-2">
                Contains Spoilers
              </Badge>
            )} */}
              <p className="text-muted-foreground font-mono text-sm leading-tight whitespace-pre-wrap">
                {shouldTruncate && !isTruncated
                  ? `${review.content?.slice(0, 300)}...`
                  : review.content}
              </p>
              {shouldTruncate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsTruncated((prev) => !prev)}
                  className="text-primary hover:text-primary mt-2 h-auto px-2 py-1"
                >
                  {isTruncated ? (
                    <>
                      Show Less <ChevronUpIcon className="ml-1 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Read More <ChevronDownIcon className="ml-1 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Review Actions */}
          {!hideHelpfulBar && (
            <div className="flex items-center gap-4 border-t p-4">
              <span className="text-muted-foreground text-sm">
                Was this helpful?
              </span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <ThumbsUpIcon className="mr-1 h-3 w-3" />0
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <ThumbsDownIcon className="mr-1 h-3 w-3" />0
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
