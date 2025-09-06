import { StarRating } from "~/components/star-rating";
import { Progress } from "~/components/ui/progress";

const ReviewSummary = () => {
  //These are just sample data
  const averageRating = 4.6;
  const ratingBreakdown = [
    { stars: 5, count: 847, percentage: 68 },
    { stars: 4, count: 312, percentage: 25 },
    { stars: 3, count: 67, percentage: 5 },
    { stars: 2, count: 18, percentage: 1 },
    { stars: 1, count: 12, percentage: 1 },
  ];
  const totalReviews = ratingBreakdown.reduce(
    (sum, item) => sum + item.count,
    0,
  );

  return (
    <div className="grid grid-cols-1 gap-6 px-4 py-8 md:grid-cols-2 lg:px-8">
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-4xl font-bold">{averageRating}</div>
          <div className="mt-1 flex items-center justify-center gap-1">
            <StarRating value={Math.round(averageRating)} />
          </div>
          <div className="text-muted-foreground mt-1 text-sm">
            Based on {totalReviews.toLocaleString()} reviews
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {ratingBreakdown.map((item) => (
          <div key={item.stars} className="flex items-center gap-2 text-sm">
            <span className="w-8">{item.stars}★</span>
            <Progress value={item.percentage} className="h-2 flex-1" />
            <span className="text-muted-foreground w-12 text-right">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSummary;
