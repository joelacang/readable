import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import AddToCartForm from "./add-to-cart-form";
import { useAddToCartDialog } from "../hooks/use-add-to-cart-dialog";

const AddToCardDialog = () => {
  const { open, book, onClose, isPending, onOpen } = useAddToCartDialog();

  return (
    <Dialog
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add To Cart</DialogTitle>
          <DialogDescription>
            Confirm the details below and add this item to your cart.
          </DialogDescription>
        </DialogHeader>
        {/* BOOK INFO HERE */}
        {book && <AddToCartForm book={book} />}
      </DialogContent>
    </Dialog>
  );
};

export default AddToCardDialog;
