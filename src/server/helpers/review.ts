import { db } from "../db";

export async function getReviewInfo({
  bookId,
}: {
  bookId: string;
}): Promise<{ averageRatings: number; totalReviews: number }> {
  const ratingStats = await db.review.aggregate({
    where: {
      bookId,
      status: "PUBLISHED",
    },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  });

  return {
    totalReviews: ratingStats._count.rating,
    averageRatings: ratingStats._avg.rating ?? 0,
  };
}
