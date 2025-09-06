import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useReviewDialog } from "../hooks/use-review-dialog";
import OrderItem from "~/features/orders/order-item";
import ReviewForm from "./review-form";

const ReviewDialog = () => {
  const { open, onClose, orderItem } = useReviewDialog();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Give Review</DialogTitle>
        </DialogHeader>
        <div>
          {orderItem && (
            <div>
              <p className="text-xs font-semibold">Order Item:</p>
              <OrderItem item={orderItem} isCompact />
              <div className="py-2">
                <ReviewForm orderItem={orderItem} />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;
