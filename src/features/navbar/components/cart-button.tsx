"use client";

import { ShoppingCartIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useCartSheet } from "~/features/cart/hooks/use-cart-sheet";
import { api } from "~/trpc/react";
import { formatNumber } from "~/utils/get-values";

interface Props {
  enabled?: boolean;
}
const CartButton = ({ enabled = false }: Props) => {
  const { data: count } = api.cart.getCartItemsCount.useQuery(undefined, {
    enabled,
  });
  const { onOpen } = useCartSheet();

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative cursor-pointer rounded-full"
        onClick={() => onOpen(count)}
      >
        <ShoppingCartIcon className="!size-6" />
      </Button>
      {count && count > 0 ? (
        <div className="absolute -top-1 -right-1">
          <div className="bg-destructive flex items-center justify-center rounded-full px-2">
            <span className="text-[10px] font-medium text-white">
              {formatNumber(count)}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CartButton;
