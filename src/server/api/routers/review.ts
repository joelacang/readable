import { OrderStatus } from "@prisma/client";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import type { OrderItemType } from "~/types/order";
import z from "zod";
import { createReviewSchema } from "~/zod-schemas/review";
import { TRPCError } from "@trpc/server";
import type { ReviewDetailType } from "~/types/review";

const pendingReviewsCondition = (loggedUserId: string) => {
  return {
    orderedById: loggedUserId,
    order: {
      status: OrderStatus.PAID,
    },
    reviews: {
      none: {
        userId: loggedUserId,
      },
    },
  };
};

export const reviewRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createReviewSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await ctx.db.$transaction(async (t) => {
          const orderItem = await t.orderItem.findUnique({
            where: { id: input.orderItemId },
          });

          if (!orderItem)
            throw new TRPCError({
              code: "UNPROCESSABLE_CONTENT",
              message: "No order item found.",
            });

          if (orderItem.orderedById !== ctx.session.user.id)
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "You are not authorized to perform this procedure.",
            });

          const review = await t.review.create({
            data: {
              rating: input.rating,
              title: input.title,
              content: input.content,
              bookId: input.bookId,
              orderItemId: input.orderItemId,
              userId: ctx.session.user.id,
            },
          });

          return review;
        });

        return result;
      } catch (error) {
        console.error(`Error creating review`, error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error creating review",
          cause: error,
        });
      }
    }),

  getPendingReviewsCount: protectedProcedure.query(async ({ ctx }) => {
    const count = await ctx.db.orderItem.count({
      where: pendingReviewsCondition(ctx.session.user.id),
    });

    return count;
  }),

  getPendingReviews: protectedProcedure.query(async ({ ctx }) => {
    const pendingReviews = await ctx.db.orderItem.findMany({
      where: pendingReviewsCondition(ctx.session.user.id),
      select: {
        id: true,
        bookId: true,
        name: true,
        price: true,
        imageUrls: true,
        format: true,
        quantity: true,
        subTotal: true,
        orderedById: true,
        order: {
          select: {
            id: true,
            refCode: true,
          },
        },
      },
    });

    const orderItemsByRefCode: Record<string, OrderItemType[]> =
      pendingReviews.reduce(
        (acc, item) => {
          const refCode = item.order.refCode;

          const orderItemDetail: OrderItemType = {
            id: item.id,
            product: {
              id: item.bookId,
              name: item.name,
              format: item.format,
              price: item.price.toNumber(),
              imageUrl: item.imageUrls[0] ?? null,
            },
            quantity: item.quantity,
            subTotal: item.subTotal.toNumber(),
          };

          acc[refCode] ??= [];
          acc[refCode].push(orderItemDetail);
          return acc;
        },
        {} as Record<string, OrderItemType[]>,
      );

    return orderItemsByRefCode;
  }),

  getReviewsByBookId: publicProcedure
    .input(z.object({ bookId: z.string() }))
    .query(async ({ ctx, input }) => {
      const reviewsData = await ctx.db.review.findMany({
        where: { bookId: input.bookId, status: "PUBLISHED" },
        include: {
          user: true,
        },
      });

      const reviews: ReviewDetailType[] = reviewsData.map((r) => ({
        id: r.id,
        title: r.title,
        content: r.content,
        rating: r.rating,
        reviewer: {
          id: r.user.id,
          name: r.user.name,
          username: r.user.username,
          image: r.user.image,
        },
        dateReviewed: r.createdAt,
        bookId: r.bookId,
        status: r.status,
        orderItemId: r.orderItemId,
      }));

      return reviews;
    }),

  getReviewsByUserId: protectedProcedure
    .input(z.object({ userId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const reviewsData = await ctx.db.review.findMany({
        where: {
          userId: input.userId ?? ctx.session.user.id,
          status: "PUBLISHED",
        },
        include: {
          user: true,
          book: {
            select: {
              id: true,
              slug: true,
              title: true,
              images: {
                select: {
                  image: {
                    select: {
                      url: true,
                    },
                  },
                },
              },
              authors: {
                select: {
                  author: true,
                },
              },
            },
          },
          orderItem: {
            select: {
              format: true,
            },
          },
        },
      });

      const reviews: ReviewDetailType[] = reviewsData.map((r) => ({
        id: r.id,
        title: r.title,
        content: r.content,
        rating: r.rating,
        reviewer: {
          id: r.user.id,
          name: r.user.name,
          username: r.user.username,
          image: r.user.image,
        },
        dateReviewed: r.createdAt,
        bookId: r.bookId,
        status: r.status,
        orderItemId: r.orderItemId,
        book: r.book && {
          details: {
            id: r.book.id,
            title: r.book.title,
            slug: r.book.slug,
            imagesUrl: r.book.images.map((i) => i.image.url),
            authors: r.book.authors.map((a) => ({
              id: a.author.id,
              name: a.author.name,
              slug: a.author.slug,
            })),
          },
          format: r.orderItem.format,
        },
      }));

      return reviews;
    }),
});
