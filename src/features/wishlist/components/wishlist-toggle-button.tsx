import { HeartIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { truncateText } from "~/utils/get-values";

interface Props {
  bookId: string;
  bookTitle: string;
  wishlistId: string | null;
  isCompact?: boolean;
}
const WishlistToggleButton = ({
  bookId,
  bookTitle,
  wishlistId,
  isCompact = false,
}: Props) => {
  const [currentWishlistId, setCurrentWishlistId] = useState<string | null>(
    wishlistId,
  );
  const { mutate: addToWishlist, isPending: isAddingToWishlist } =
    api.wishlist.add.useMutation();
  const { mutate: removeFromWishlist, isPending: isRemovingFromWishlist } =
    api.wishlist.remove.useMutation();
  const utils = api.useUtils();

  const isPending = isAddingToWishlist || isRemovingFromWishlist;

  const handleAddToWishlist = () => {
    const addToWishlistToast = toast.loading(
      `Adding '${truncateText(bookTitle, 16, false)}' to your WishList`,
    );

    addToWishlist(
      { bookId },
      {
        onSuccess: (response) => {
          if (response) {
            toast.success(
              `Book '${truncateText(bookTitle, 16)}' added to your wishlist.`,
            );

            utils.wishlist.getCount.setData(undefined, (prev) => {
              return (prev ?? 0) + 1;
            });

            utils.wishlist.getWishlistItems.setData(undefined, (prev) => {
              if (!prev) return [];

              const updatedItems = [...prev, response];

              return updatedItems;
            });

            setCurrentWishlistId(response.id);
          } else {
            toast.success(
              `The Book '${truncateText(bookTitle, 16)}' is already added to your wishlist.`,
            );
          }
        },
        onError: (error) => {
          toast.error(
            `Error adding book '${truncateText(bookTitle, 16)}' to your wishlist: ${error.message}`,
          );
        },
        onSettled: () => {
          toast.dismiss(addToWishlistToast);
        },
      },
    );
  };

  const handleRemoveFromWishlist = () => {
    if (!currentWishlistId) return;

    const removeFromWishlistToast = toast.loading(
      `Removing '${truncateText(bookTitle, 16)}' from your wishlist`,
    );

    removeFromWishlist(
      { wishlistId: currentWishlistId },
      {
        onSuccess: () => {
          toast.success(
            `'${truncateText(bookTitle, 16)}' removed from wishlist.`,
          );
          utils.wishlist.getCount.setData(undefined, (prev) => {
            return Math.max((prev ?? 0) - 1, 0);
          });

          utils.wishlist.getWishlistItems.setData(undefined, (prev) => {
            if (!prev) return [];

            return prev.filter((i) => i.id !== currentWishlistId);
          });

          setCurrentWishlistId(null);
        },
        onError: (error) => {
          toast.error(`Error removing wishlist: ${error.message}`);
        },
        onSettled: () => {
          toast.dismiss(removeFromWishlistToast);
        },
      },
    );
  };

  const handleWishlistAction = () => {
    if (currentWishlistId) {
      handleRemoveFromWishlist();
    } else {
      handleAddToWishlist();
    }
  };

  return (
    <Button
      className={cn(
        "text-primary size-fit p-2 hover:bg-rose-100 hover:text-rose-500",
        isCompact ? "rounded-full" : "rounded-lg",
      )}
      variant={isCompact ? "ghost" : "outline"}
      size="icon"
      disabled={isPending}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleWishlistAction();
      }}
    >
      <HeartIcon
        className={"!size-4"}
        fill={currentWishlistId ? "#f43f5e" : "transparent"}
      />
    </Button>
  );
};

export default WishlistToggleButton;
