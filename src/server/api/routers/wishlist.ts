import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { getWishlistItem } from "~/server/helpers/wishlist";
import type { WishListItemType } from "~/types/wishlist";

export const wishlistRouter = createTRPCRouter({
  add: protectedProcedure
    .input(z.object({ bookId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const results = await ctx.db.$transaction(async (t) => {
          const existingItem = await t.wishlistItem.findFirst({
            where: {
              userId: ctx.session.user.id,
              bookId: input.bookId,
            },
          });

          if (existingItem) return null;

          const wishlist = await t.wishlistItem.create({
            data: {
              userId: ctx.session.user.id,
              bookId: input.bookId,
            },
            select: { id: true },
          });

          return await getWishlistItem({
            wishlistId: wishlist.id,
            transaction: t,
          });
        });

        return results;
      } catch (error) {
        console.error("Error adding to wishlist", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error adding to wishlist",
          cause: error,
        });
      }
    }),

  remove: protectedProcedure
    .input(z.object({ wishlistId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const results = await ctx.db.$transaction(async (t) => {
          const wishlist = await t.wishlistItem.findUnique({
            where: { id: input.wishlistId },
          });

          if (!wishlist)
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Wishlist Not Found.",
            });

          if (wishlist.userId !== ctx.session.user.id)
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "You are not allowed to remove this wishlist item.",
            });

          await t.wishlistItem.delete({
            where: { id: input.wishlistId },
          });

          return input.wishlistId;
        });

        return results;
      } catch (error) {
        console.log(`Error removing wishlist:`, error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unknown error occurred.",
          cause: error,
        });
      }
    }),

  getCount: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.wishlistItem.count({
      where: { userId: ctx.session.user.id },
    });
  }),

  getWishlistItems: protectedProcedure.query(async ({ ctx }) => {
    const itemsData = await ctx.db.wishlistItem.findMany({
      where: { userId: ctx.session.user.id },
      select: {
        id: true,
        createdAt: true,
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
                author: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!itemsData) return [];

    const items: WishListItemType[] = itemsData.map((item) => {
      const { authors, images, ...others } = item.book;

      return {
        id: item.id,
        dateAdded: item.createdAt,
        book: {
          ...others,
          authors: authors.map((a) => a.author),
          imagesUrl: images.map((i) => i.image.url),
        },
      };
    });

    return items;
  }),
});
