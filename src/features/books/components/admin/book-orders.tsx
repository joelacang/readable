import { XIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Hint from "~/components/hint";
import { QueryStateHandler } from "~/components/query-state-handler";
import { Button } from "~/components/ui/button";
import LoadOrderByRef from "~/features/orders/load-order-by-ref";
import OrderPreviewCard from "~/features/orders/order-preview-card";
import { cn } from "~/lib/utils";
import { useBook } from "~/providers/book-provider";
import { api } from "~/trpc/react";

interface Props {
  bookId: string;
}
const BookOrders = ({ bookId }: Props) => {
  const {
    data: orders,
    isLoading,
    isError,
    error,
  } = api.order.getOrdersByBookId.useQuery({ bookId });
  const { viewParam } = useParams();
  const orderCodeParam = viewParam?.[1];
  const router = useRouter();
  const { book } = useBook();

  return (
    <QueryStateHandler
      isLoading={isLoading}
      isError={isError}
      errorMessage={error?.message ?? "An unknown error occurred"}
      data={orders}
      loadingLabel="Loading Book Orders..."
      emptyTitle="No Orders Found."
      emptyDescription="No Orders Found for this book. Please try again."
    >
      {(orders) => (
        <div className="@container relative">
          {orderCodeParam ? (
            <LoadOrderByRef ref={orderCodeParam} />
          ) : (
            <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
              {orders.map((order) => (
                <OrderPreviewCard order={order} key={order.id} />
              ))}
            </div>
          )}

          <div
            className={cn(
              "absolute -top-16 -right-2",
              orderCodeParam ? "block" : "hidden",
            )}
          >
            <Hint label="Exit Order">
              <Button
                className="text-primary hover:text-primary rounded-full"
                variant="outline"
                size="icon"
                onClick={() => router.push(`/admin/books/${book.slug}/orders`)}
              >
                <XIcon />
              </Button>
            </Hint>
          </div>
        </div>
      )}
    </QueryStateHandler>
  );
};

export default BookOrders;
