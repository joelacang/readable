import type React from "react";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import ReviewSummary from "./review-summary";
import BookReviewList from "./book-review-list";

interface Props {
  bookId: string;
}
export function ReviewsCard({ bookId }: Props) {
  const [sortBy, setSortBy] = useState("newest");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Reviews & Ratings</CardTitle>
      </CardHeader>
      <CardContent className="w-full space-y-6">
        {/* Rating Summary */}
        <ReviewSummary bookId={bookId} />

        {/* Action Buttons */}

        <div className="flex flex-wrap items-center gap-2">
          <Label htmlFor="sort-reviews" className="text-sm">
            Sort by:
          </Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="highest">Highest Rated</SelectItem>
              <SelectItem value="lowest">Lowest Rated</SelectItem>
              <SelectItem value="helpful">Most Helpful</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reviews List */}
        <BookReviewList bookId={bookId} />

        {/* Load More Button */}
        <div className="text-center">
          <Button variant="outline">Load More Reviews</Button>
        </div>
      </CardContent>
    </Card>
  );
}
