import { MessageSquareIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import type { OrderItemType } from "~/types/order";
import { useReviewDialog } from "../reviews/hooks/use-review-dialog";
import { cn } from "~/lib/utils";

interface Props {
  item: OrderItemType;
  showReviewButton?: boolean;
  isCompact?: boolean;
}

const OrderItem = ({
  item,
  showReviewButton = false,
  isCompact = false,
}: Props) => {
  const { onOpen } = useReviewDialog();
  return (
    <div
      key={item.id}
      className={cn(
        isCompact ? "gap-2 p-2" : "gap-4 border p-4",
        "flex items-center",
      )}
    >
      <div
        className={cn(
          isCompact ? "size-12" : "size-20",
          "relative aspect-square overflow-hidden rounded-lg",
        )}
      >
        <Image
          fill
          src={item.product.imageUrl ?? "/placeholder.svg"}
          alt={item.product.name}
          objectFit="contain"
        />
      </div>

      <div className="flex-1 space-y-1">
        <h4
          className={cn(
            isCompact ? "text-sm leading-none font-semibold" : "text-base",
            "font-medium",
          )}
        >
          {item.product.name}
        </h4>
        <p
          className={cn(
            isCompact ? "text-xs" : "text-sm",
            "text-muted-foreground",
          )}
        >
          {item.product.format}
        </p>
        {!isCompact && (
          <div className="flex items-center justify-between">
            <p className={cn(isCompact ? "text-xs" : "text-sm", "font-medium")}>
              Quantity: {item.quantity}
            </p>

            <>
              {showReviewButton ? (
                <Button onClick={() => onOpen(item)}>
                  <MessageSquareIcon />
                  Give Review
                </Button>
              ) : (
                <div className="text-right">
                  <p className="text-muted-foreground text-sm">
                    ${item.product.price} each
                  </p>
                  <p className="font-medium">${item.subTotal}</p>
                </div>
              )}
            </>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderItem;
