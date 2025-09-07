"use client";

import { SearchXIcon, TriangleAlertIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Loading from "~/components/loading";
import MessageBox from "~/components/message-box";
import OrderDetails from "~/features/orders/order-details";
import PageHeader from "~/features/page/components/page-header";
import { api } from "~/trpc/react";
import { ModeType } from "~/types/component";

const OrderDetailsPage = () => {
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref");

  const {
    data: order,
    isLoading,
    isError,
    error,
  } = api.order.getOrderByRef.useQuery(
    { ref: refCode },
    { enabled: !!refCode },
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loading label="Loading Order..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-8">
        <MessageBox
          title="Error loading order"
          description={error.message}
          mode={ModeType.ERROR}
          icon={TriangleAlertIcon}
        />
      </div>
    );
  }

  if (!order) {
    <div className="flex items-center justify-center py-8">
      <MessageBox
        title="Order not found"
        description={`Order with reference code: ${refCode} not found. Please try again.`}
        mode={ModeType.ERROR}
        icon={SearchXIcon}
      />
    </div>;
  }

  return (
    <div>
      <PageHeader
        title="Order Detail"
        description={`Order Information for Order Ref. Code: ${refCode}`}
      />
      {order && <OrderDetails order={order} />}
    </div>
  );
};

export default OrderDetailsPage;
