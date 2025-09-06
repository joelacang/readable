import { QueryStateHandler } from "~/components/query-state-handler";
import { api } from "~/trpc/react";
import OrderDetails from "./order-details";

interface Props {
  ref: string;
}

const LoadOrderByRef = ({ ref }: Props) => {
  const {
    data: order,
    isLoading,
    isError,
    error,
  } = api.order.getOrderByRef.useQuery({ ref });

  return (
    <QueryStateHandler
      data={order}
      isLoading={isLoading}
      isError={isError}
      loadingLabel={`Loading Order Ref: ${ref}`}
      errorMessage={error?.message ?? "An unknown error occurred."}
      errorTitle={`Error loading order with ref: ${ref}`}
      emptyTitle="No Order Found."
      emptyDescription={`No Order Found for ref#: ${ref}`}
    >
      {(order) => (
        <div className="flex flex-col">
          <p className="text-muted-foreground pb-2 font-mono text-sm font-medium">
            Order Detail for Order Ref. #:&nbsp;
            <span className="font-semibold text-blue-500">{ref}</span>
          </p>
          <OrderDetails order={order} />
        </div>
      )}
    </QueryStateHandler>
  );
};

export default LoadOrderByRef;
