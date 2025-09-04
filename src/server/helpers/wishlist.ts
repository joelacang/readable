import type { Prisma } from "@prisma/client";
import type { WishListItemType } from "~/types/wishlist";

export async function getWishlistItem({
  wishlistId,
  transaction,
}: {
  wishlistId: string;
  transaction: Prisma.TransactionClient;
}): Promise<WishListItemType | null> {
  const wishlist = await transaction.wishlistItem.findUnique({
    where: { id: wishlistId },
    select: {
      id: true,
      book: {
        select: {
          id: true,
          title: true,
          slug: true,
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
      createdAt: true,
    },
  });

  if (!wishlist) return null;

  const { authors, images, ...others } = wishlist.book;

  return {
    id: wishlist.id,
    dateAdded: wishlist.createdAt,
    book: {
      ...others,
      authors: authors.map((a) => a.author),
      imagesUrl: images.map((i) => i.image.url),
    },
  };
}
