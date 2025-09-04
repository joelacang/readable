import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { useCartSheet } from "../hooks/use-cart-sheet";
import CartItems from "./cart-items";

const CartSheet = () => {
  const { open, onClose, onOpen, isPending, count } = useCartSheet();

  return (
    <Sheet
      open={open}
      onOpenChange={(openValue) => {
        if (isPending) return;
        if (openValue) {
          onOpen();
        } else {
          onClose();
        }
      }}
    >
      <SheetContent className="space-y-0">
        <SheetHeader className="p-4">
          <SheetTitle>Your Cart</SheetTitle>
          <SheetDescription>
            You have <span className="text-primary font-semibold">{count}</span>
            &nbsp;item{count > 1 && "s"} on your cart.
          </SheetDescription>
        </SheetHeader>
        <div className="flex h-full w-full flex-col">
          <CartItems />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
