import Image from "next/image";
import Link from "next/link";
import CloseButton from "~/components/close-button";
import { api } from "~/trpc/react";
import type { WishListItemType } from "~/types/wishlist";
import { useWishlistSheet } from "../hooks/use-wishlist-sheet";
import toast from "react-hot-toast";
import { truncateText } from "~/utils/get-values";

interface Props {
  item: WishListItemType;
}
const WishlistItem = ({ item }: Props) => {
  const { mutate: removeWishlistItem, isPending: pendingRemovalMutation } =
    api.wishlist.remove.useMutation();
  const utils = api.useUtils();

  const {
    onPending: onPendingWishlistAction,
    onCompleted: onWishlistActionCompleted,
    isPending: pendingWishlistAction,
  } = useWishlistSheet();

  const book = item.book;
  const authors = item.book.authors.map((a) => a.name).join(", ");
  const isPending = pendingRemovalMutation || pendingWishlistAction;

  const handleClose = () => {
    onPendingWishlistAction();
    const removeWishlistToast = toast.loading(
      `Removing '${truncateText(book.title, 16)}' from wishlist...`,
    );
    removeWishlistItem(
      { wishlistId: item.id },
      {
        onSuccess: () => {
          toast.success(
            `'${truncateText(book.title, 16)}' removed from wishlist.`,
          );
          utils.wishlist.getCount.setData(undefined, (prev) => {
            return Math.max((prev ?? 0) - 1, 0);
          });
          utils.wishlist.getWishlistItems.setData(undefined, (prev) => {
            if (!prev) return [];

            return prev.filter((i) => i.id !== item.id);
          });
        },
        onError: (error) => {
          toast.error(
            `Error removing '${truncateText(book.title, 16)}' from wishlist: ${error.message}`,
          );
        },
        onSettled: () => {
          toast.dismiss(removeWishlistToast);
          onWishlistActionCompleted();
        },
      },
    );
  };
  return (
    <div className="hover:bg-muted/50 relative flex cursor-pointer flex-row items-center gap-4 px-4 py-2">
      <div className="relative h-20 w-16 flex-shrink-0 cursor-pointer overflow-hidden rounded bg-transparent">
        {book.imagesUrl?.[0] ? (
          <Image
            fill
            src={book.imagesUrl[0]}
            alt={book.title}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200">
            <span className="text-xs text-gray-400">No Image</span>
          </div>
        )}
      </div>
      <div className="">
        <Link
          href={`/books/${item.book.slug}`}
          className="text-primary line-clamp-1 cursor-pointer text-sm font-semibold hover:underline hover:underline-offset-2"
        >
          {item.book.title}
        </Link>
        <p className="text-muted-foreground line-clamp-1 text-sm leading-none">
          {authors}
        </p>
        <p className="text-accent-foreground pt-2 text-xs">
          Added: {item.dateAdded.toLocaleDateString()}
        </p>
      </div>
      <div className="absolute top-2 right-2">
        <CloseButton onClose={handleClose} isPending={isPending} />
      </div>
    </div>
  );
};

export default WishlistItem;
