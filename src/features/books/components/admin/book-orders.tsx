import { XIcon } from "lucide-react";
import { useState } from "react";
import Hint from "~/components/hint";
import { QueryStateHandler } from "~/components/query-state-handler";
import { Button } from "~/components/ui/button";
import LoadOrderByRef from "~/features/orders/load-order-by-ref";
import OrderDetails from "~/features/orders/order-details";
import OrderPreviewCard from "~/features/orders/order-preview-card";
import { orderColumns } from "~/features/orders/table/columns";
import { OrdersDataTable } from "~/features/orders/table/data-table";
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
  const { currentOrderRef, setCurrentOrderRef } = useBook();

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
          {currentOrderRef ? (
            <LoadOrderByRef ref={currentOrderRef} />
          ) : (
            <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
              {orders.map((order) => (
                <OrderPreviewCard
                  onChangeOrder={setCurrentOrderRef}
                  order={order}
                  key={order.id}
                />
              ))}
            </div>
          )}

          <div
            className={cn(
              "absolute -top-16 -right-2",
              currentOrderRef ? "block" : "hidden",
            )}
          >
            <Hint label="Exit Order">
              <Button
                className="text-primary hover:text-primary rounded-full"
                variant="outline"
                size="icon"
                onClick={() => setCurrentOrderRef(null)}
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
