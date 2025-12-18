import type { BookRating } from "~/types/review";
import { db } from "../db";

export async function getBookRating({
  bookId,
}: {
  bookId: string;
}): Promise<BookRating> {
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
    average: ratingStats._avg.rating ?? 0,
  };
}
