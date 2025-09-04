import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

import { getActiveUserCartId, getCartItem } from "~/server/helpers/cart";
import { TRPCError } from "@trpc/server";
import type { CartItemsType, CartType } from "~/types/cart";
import { BookFormat } from "@prisma/client";
import { truncateText } from "~/utils/get-values";

export const cartRouter = createTRPCRouter({
  addToCart: protectedProcedure
    .input(
      z.object({
        bookId: z.string().cuid(),
        variantId: z.string().cuid(),
        quantity: z.number().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const results = await ctx.db.$transaction(async (t) => {
          const userCartId = await getActiveUserCartId({
            loggedUserId: ctx.session.user.id,
            transaction: t,
          });

          const existingItem = await t.cartItem.findFirst({
            where: { cartId: userCartId, variantId: input.variantId },
            select: {
              id: true,
              quantity: true,
              book: {
                select: {
                  title: true,
                },
              },
              variant: {
                select: {
                  format: true,
                },
              },
            },
          });

          if (existingItem) {
            if (existingItem.variant.format !== BookFormat.Digital) {
              const item = await t.cartItem.update({
                where: { id: existingItem.id },
                data: {
                  quantity: existingItem.quantity + input.quantity,
                },
                select: {
                  id: true,
                },
              });

              const cartItem = await getCartItem({
                cartItemId: item.id,
                transaction: t,
              });

              if (!cartItem) return { cartItem: null, addToCount: false };

              return {
                cartItem,
                addToCount: false,
                toastMessage: `Your cart has been updated. Updated quantity of ${cartItem?.quantity} to ${truncateText(cartItem.book.title, 16)} ${cartItem.variant.format}`,
              };
            } else {
              return {
                cartItem: null,
                addToCount: false,
                toastMessage: "You already added this to your cart.",
              };
            }
          }

          const newItem = await t.cartItem.create({
            data: {
              cartId: userCartId,
              variantId: input.variantId,
              quantity: input.quantity,
              bookId: input.bookId,
              createdById: ctx.session.user.id,
            },
            select: {
              id: true,
            },
          });

          const cartItem = await getCartItem({
            cartItemId: newItem.id,
            transaction: t,
          });

          if (!cartItem) return { cartItem: null, addToCount: false };
          return {
            cartItem,
            addToCount: true,
            toastMessage: `Your cart has been updated. Added ${truncateText(cartItem.book.title, 16)} ${cartItem.variant.format} Format to your cart.`,
          };
        });

        return results;
      } catch (error) {
        console.error(`Error adding cart item.`, error);
        throw new TRPCError({
          code: "UNPROCESSABLE_CONTENT",
          message: "Something went wrong while adding the cart item.",
        });
      }
    }),

  removeFromCart: protectedProcedure
    .input(z.object({ cartItemId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const results = await ctx.db.$transaction(async (t) => {
          const cartItem = await t.cartItem.findUnique({
            where: { id: input.cartItemId },
          });

          if (!cartItem)
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "CartItem not found.",
            });

          if (cartItem.createdById !== ctx.session.user.id)
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "You are not allowed to remove this Cart Item",
            });

          const removedCartItem = await t.cartItem.delete({
            where: { id: input.cartItemId },
          });

          return { success: true, id: input.cartItemId };
        });

        return results;
      } catch (error) {
        console.error(`Error adding item to cart`, error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error adding item to cart",
          cause: error,
        });
      }
    }),

  getCartItemsCount: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.cartItem.count({
      where: { createdById: ctx.session.user.id },
    });
  }),

  getCartItems: protectedProcedure.query(async ({ ctx }) => {
    const cartData = await ctx.db.cart.findUnique({
      where: { userId: ctx.session.user.id },
      select: {
        id: true,
        items: {
          select: {
            id: true,
            book: {
              select: {
                id: true,
                slug: true,
                title: true,
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
                images: {
                  select: {
                    image: {
                      select: {
                        url: true,
                      },
                    },
                  },
                },
              },
            },
            variant: {
              select: {
                id: true,
                format: true,
                price: true,
                stock: true,
              },
            },
            quantity: true,
          },
        },
      },
    });

    if (!cartData) return null;

    const items: CartItemsType[] = cartData.items.map((item) => {
      const { book, variant, ...others } = item;

      return {
        ...others,
        book: {
          ...book,
          imagesUrl: book.images.map((i) => i.image.url),
          authors: book.authors.map((a) => a.author),
        },
        variant: {
          ...variant,
          price: variant.price.toNumber(),
        },
      };
    });

    return { id: cartData.id, items } satisfies CartType;
  }),

  addQuantity: protectedProcedure
    .input(z.object({ cartItemId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const results = await ctx.db.$transaction(async (t) => {
          const item = await t.cartItem.findUnique({
            where: { id: input.cartItemId },
            select: {
              id: true,
              quantity: true,
              variant: true,
            },
          });

          if (!item)
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Cart Item Not Found",
            });

          if (item.quantity >= item.variant.stock)
            return {
              success: false,
              item: { id: item.id, quantity: item.quantity },
            };

          const updatedItem = await t.cartItem.update({
            where: { id: input.cartItemId },
            data: {
              quantity: item.quantity + 1,
            },
            select: {
              id: true,
              quantity: true,
            },
          });

          return {
            success: true,
            item: { id: updatedItem.id, quantity: updatedItem.quantity },
          };
        });

        return results;
      } catch (error) {
        console.error("unable to add quantity", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to add quantity. An error occurred.",
          cause: error,
        });
      }
    }),

  deductQuantity: protectedProcedure
    .input(z.object({ cartItemId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const results = await ctx.db.$transaction(async (t) => {
          const item = await t.cartItem.findUnique({
            where: { id: input.cartItemId },
            select: {
              id: true,
              quantity: true,
              variant: true,
            },
          });

          if (!item)
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Cart Item Not Found.",
            });

          if (item.quantity <= 1)
            return {
              success: false,
              item: {
                id: item.id,
                quantity: item.quantity,
              },
            };

          const updatedItem = await t.cartItem.update({
            where: { id: item.id },
            data: {
              quantity: item.quantity - 1,
            },
            select: {
              id: true,
              quantity: true,
            },
          });

          return {
            success: true,
            item: { id: updatedItem.id, quantity: updatedItem.quantity },
          };
        });

        return results;
      } catch (error) {
        console.error("Unable to deduct quantity: ", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unknown error occurred",
          cause: error,
        });
      }
    }),

  updateQuantity: protectedProcedure
    .input(
      z.object({ cartItemId: z.string().cuid(), quantity: z.number().min(1) }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const results = await ctx.db.$transaction(async (t) => {
          const item = await t.cartItem.findUnique({
            where: { id: input.cartItemId },
            select: {
              id: true,
              quantity: true,
              variant: true,
            },
          });

          if (!item)
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Cart Item not found.",
            });

          if (input.quantity > item.variant.stock || input.quantity < 1)
            return {
              success: false,
              item: {
                id: item.id,
                quantity: item.quantity,
              },
            };

          const updatedItem = await t.cartItem.update({
            where: { id: input.cartItemId },
            data: { quantity: input.quantity },
            select: {
              id: true,
              quantity: true,
            },
          });
          return {
            success: true,
            item: {
              id: updatedItem.id,
              quantity: updatedItem.quantity,
            },
          };
        });
        return results;
      } catch (error) {
        console.error("Error updating quantity", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error updating quantity`,
          cause: error,
        });
      }
    }),
});
