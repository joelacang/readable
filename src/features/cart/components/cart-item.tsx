import { MinusIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import type { CartItemsType } from "~/types/cart";
import { useCartSheet } from "../hooks/use-cart-sheet";
import CloseButton from "~/components/close-button";
import { formatPrice } from "~/utils/get-values";
import { BookFormat } from "@prisma/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  item: CartItemsType;
}
export default function CartItem({ item }: Props) {
  const { book, variant } = item;
  const [localQuantity, setLocalQuantity] = useState(item.quantity);

  const unitPrice = variant.price;
  const totalPrice = unitPrice * localQuantity;

  const authorsText = book.authors.map((author) => author.name).join(", ");
  const { mutate: removeFromCart, isPending: isMutatingRemoval } =
    api.cart.removeFromCart.useMutation();
  const { mutate: updateQuantity, isPending: isUpdatingQuantity } =
    api.cart.updateQuantity.useMutation();
  const utils = api.useUtils();
  const isOutOfStock =
    variant.stock === 0 && variant.format !== BookFormat.Digital;
  const router = useRouter();

  const {
    onPending,
    onCompleted,
    isPending: isRemovingCartItem,
  } = useCartSheet();

  const isPending =
    isMutatingRemoval || isRemovingCartItem || isUpdatingQuantity;

  useEffect(() => {
    if (item.quantity !== localQuantity) {
      setLocalQuantity(item.quantity);
    }
  }, [item.quantity]);

  useEffect(() => {
    utils.cart.getCartItems.setData(undefined, (prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        items: prev.items.map((i) =>
          i.id === item.id ? { ...i, quantity: localQuantity } : i,
        ),
      };
    });
  }, [localQuantity]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateQuantity({ quantity: localQuantity, cartItemId: item.id });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [localQuantity, item.quantity, variant.stock]);

  const handleQuantityIncrease = () => {
    if (localQuantity < variant.stock) {
      setLocalQuantity((prev) => prev + 1);
    }
  };

  const handleQuantityDecrease = () => {
    if (localQuantity > 1) {
      setLocalQuantity((prev) => prev - 1);
    }
  };

  const handleRemove = () => {
    onPending();
    const removeFromCartToast = toast.loading(
      `Removing ${item.book.title} from cart...`,
    );
    removeFromCart(
      { cartItemId: item.id },
      {
        onSuccess: () => {
          toast.success(`${item.book.title} removed from cart.`);
          utils.cart.getCartItemsCount.setData(undefined, (prev) => {
            return Math.max((prev ?? 0) - 1, 0);
          });
          utils.cart.getCartItems.setData(undefined, (prev) => {
            if (!prev) return { id: "", items: [] };

            return {
              ...prev,
              items: prev.items.filter((i) => i.id !== item.id),
            };
          });
        },
        onError: (error) => {
          toast.error(`Error removing item from cart: ${error.message}`);
        },
        onSettled: () => {
          toast.dismiss(removeFromCartToast);
          onCompleted();
        },
      },
    );
  };
  return (
    <div className="flex gap-3 border-b border-gray-200 px-3 py-4 last:border-b-0">
      {/* Book Image */}
      <div
        className="relative h-20 w-16 flex-shrink-0 cursor-pointer overflow-hidden rounded"
        onClick={() => router.push(`/books/${book.slug}`)}
      >
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

      {/* Item Details */}
      <div className="min-w-0 flex-1">
        {/* Title and Remove Button */}
        <div className="relative flex items-start justify-between gap-2">
          <Link
            href={`/books/${book.slug}`}
            className="text-primary line-clamp-2 pr-10 text-sm leading-tight font-medium hover:underline hover:underline-offset-2"
          >
            {book.title}
          </Link>
          <div className="absolute top-0 right-0">
            <CloseButton isPending={isPending} onClose={handleRemove} />
          </div>
        </div>

        {/* Authors */}
        <p className="mb-2 line-clamp-1 text-xs text-gray-600">
          by {authorsText}
        </p>

        {/* Format and Price */}
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500">
            {variant.format}
          </span>
          <span className="text-xs font-light text-gray-900">
            {formatPrice(unitPrice)}
          </span>
        </div>

        {/* Quantity Controls and Total */}
        <div className="flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex-1">
            {item.variant.format !== BookFormat.Digital && !isOutOfStock && (
              <div className="flex items-center gap-2">
                <Button
                  disabled={localQuantity <= 1 || isPending}
                  className="border-primary text-primary hover:bg-muted flex h-7 w-7 items-center justify-center rounded border transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                  variant="outline"
                  aria-label="Decrease quantity"
                  onClick={handleQuantityDecrease}
                >
                  <MinusIcon size={14} />
                </Button>

                <span className="min-w-[2rem] text-center text-sm font-medium">
                  {localQuantity}
                </span>

                <Button
                  disabled={localQuantity >= variant.stock || isPending}
                  className="border-primary text-primary hover:bg-muted hover:text-primary flex h-7 w-7 items-center justify-center rounded border transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Increase quantity"
                  variant="outline"
                  onClick={handleQuantityIncrease}
                >
                  <PlusIcon size={14} />
                </Button>
              </div>
            )}
          </div>

          {/* Total Price */}
          <div className="text-right">
            <div className="flex items-center justify-end border-t border-t-2 pt-2 pl-6 text-sm font-semibold text-gray-900">
              {formatPrice(totalPrice)}
            </div>
          </div>
        </div>

        {/* Stock Warning */}
        {variant.stock <= 5 && variant.stock > 0 && (
          <p className="mt-1 text-xs text-amber-600">
            Only {variant.stock} left in stock
          </p>
        )}

        {isOutOfStock && (
          <p className="mt-1 text-xs text-red-600">Out of stock</p>
        )}
      </div>
    </div>
  );
}
