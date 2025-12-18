import z from "zod";

export const createReviewSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, "Please enter your rating")
    .max(5, "Invalid Rating"),
  title: z.string().max(124).optional(),
  content: z.string().min(4),
  orderItemId: z.string().cuid(),
  bookId: z.string().cuid().optional(),
});
