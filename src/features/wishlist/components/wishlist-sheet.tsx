import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { useWishlistSheet } from "../hooks/use-wishlist-sheet";
import WishListItems from "./wishlist-items";

const WishlistSheet = () => {
  const { open, onClose, onOpen, isPending } = useWishlistSheet();

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
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your Wishlist</SheetTitle>
          <SheetDescription>
            Here are your items on your wishlist.
          </SheetDescription>
        </SheetHeader>
        <div className="h-full overflow-y-auto">
          <WishListItems />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default WishlistSheet;
