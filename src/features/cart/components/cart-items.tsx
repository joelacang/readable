import { Loader2Icon, SearchXIcon, TriangleAlertIcon } from "lucide-react";
import Loading from "~/components/loading";
import MessageBox from "~/components/message-box";
import { api } from "~/trpc/react";
import { ModeType } from "~/types/component";
import CartItem from "./cart-item";
import { formatPrice } from "~/utils/get-values";
import { SheetFooter } from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import toast from "react-hot-toast";
import { useCartSheet } from "../hooks/use-cart-sheet";

const CartItems = () => {
  const {
    data: cartItems,
    isLoading,
    isError,
    error,
  } = api.cart.getCartItems.useQuery();
  const { mutate: createCheckout, isPending: isCheckingOut } =
    api.checkout.create.useMutation();
  const { onPending: onCheckoutPending, onCompleted: onCheckoutCompleted } =
    useCartSheet();

  const shippingFee = 10;
  const discount = 0;

  const isPending = isCheckingOut;
  if (isLoading) {
    return (
      <div className="py-8">
        <Loading label="Loading Cart items..." />
      </div>
    );
  }

  const handleCheckout = () => {
    onCheckoutPending();
    createCheckout(undefined, {
      onSuccess: (res) => {
        if (res.url) window.location.href = res.url;
      },
      onError: (error) => {
        toast.error(`Failed to create checkout session: ${error.message}`);
      },
      onSettled: () => onCheckoutCompleted(),
    });
  };

  if (isError) {
    return (
      <MessageBox
        title="Error Loading Cart."
        description={error.message}
        icon={TriangleAlertIcon}
        mode={ModeType.ERROR}
        isCompact
      />
    );
  }

  if (!cartItems) {
    return (
      <MessageBox
        title="No Cart Found"
        description="No cart has been found in your account."
        icon={TriangleAlertIcon}
        mode={ModeType.ERROR}
        isCompact
      />
    );
  }

  if (!cartItems.items.length) {
    return (
      <MessageBox
        title="No Items On Your Cart"
        description="Sorry, there are no items in your cart."
        icon={SearchXIcon}
        mode={ModeType.DEFAULT}
        isCompact
      />
    );
  }

  const subTotalPrice = cartItems.items.reduce((acc, item) => {
    return acc + item.variant.price * item.quantity;
  }, 0);

  const roundedSubTotal = Math.round(subTotalPrice * 100) / 100;

  return (
    <div className="flex flex-col">
      <div className="h-[calc(100vh-280px)] w-full overflow-y-auto">
        {cartItems.items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
      <SheetFooter className="border-t-primary w-full shrink-0 border-t px-4 py-3">
        <div className="h-full w-full space-y-2 overflow-y-auto text-sm">
          {/* Subtotal */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Subtotal</span>
            <span>{formatPrice(roundedSubTotal)}</span>
          </div>

          {/* Shipping discount */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Shipping Fee</span>
            <span>{formatPrice(shippingFee)}</span>
          </div>

          {/* Discounts */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Discount</span>
            <span className="text-rose-500">-{formatPrice(discount)}</span>
          </div>

          {/* Divider */}
          <div className="my-1 border-t border-gray-100" />

          {/* Total */}
          <div className="flex items-center justify-between font-semibold text-gray-900">
            <span className="text-base">Total</span>
            <span className="text-xl">
              {formatPrice(roundedSubTotal + shippingFee - discount)}
            </span>
          </div>

          {/* Checkout button */}
          <Button
            className="w-full"
            disabled={isCheckingOut}
            onClick={handleCheckout}
          >
            {isCheckingOut && <Loader2Icon className="animate-spin" />}
            {isCheckingOut ? "Redirecting..." : "Checkout"}
          </Button>
        </div>
      </SheetFooter>
    </div>
  );
};

export default CartItems;
