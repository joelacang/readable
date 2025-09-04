import { PrismaClient, type CartItem, type Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import type { CartItemsType } from "~/types/cart";
import { generateId } from "~/utils/get-values";

export async function getActiveUserCartId({
  loggedUserId,
  transaction,
}: {
  loggedUserId: string;
  transaction: Prisma.TransactionClient;
}): Promise<string> {
  const existingCart = await transaction.cart.findUnique({
    where: { userId: loggedUserId },
    select: { id: true },
  });

  if (existingCart) return existingCart.id;

  const newCart = await transaction.cart.create({
    data: {
      userId: loggedUserId,
      name: `cart-` + generateId(12),
    },
    select: { id: true },
  });

  return newCart.id;
}

export async function getCartItem({
  cartItemId,
  transaction,
}: {
  cartItemId: string;
  transaction: Prisma.TransactionClient;
}): Promise<CartItemsType | null> {
  const itemData = await transaction.cartItem.findUnique({
    where: { id: cartItemId },
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
  });

  if (!itemData) return null;

  const { book, variant, ...others } = itemData;

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
  } satisfies CartItemsType;
}

export async function clearCart({
  userId,
  cartId,
  transaction,
  requireOwnership = true, // Default to secure
}: {
  userId: string;
  cartId: string;
  transaction: Prisma.TransactionClient;
  requireOwnership?: boolean;
}): Promise<{ success: boolean }> {
  try {
    const cart = await transaction.cart.findUnique({
      where: { id: cartId },
    });

    if (!cart) {
      throw new Error("Cart not found");
    }

    if (requireOwnership && userId !== cart.userId) {
      throw new Error("Unauthorized to modify this cart");
    }

    await transaction.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return { success: true };
  } catch (error) {
    console.error("Unable to clear cart", error);
    throw error;
  }
}
