"use client";

import { SearchXIcon, TriangleAlertIcon } from "lucide-react";
import Loading from "~/components/loading";
import MessageBox from "~/components/message-box";
import { api } from "~/trpc/react";
import { ConfirmationType } from "~/types/component";
import { OrdersDataTable } from "./table/data-table";
import { orderColumns } from "./table/columns";

interface Props {
  userId?: string | null;
}
const UserOrders = ({ userId = null }: Props) => {
  const {
    data: orders,
    isLoading,
    isError,
    error,
  } = api.order.getUserOrders.useQuery({ userId });

  if (isLoading) {
    return <Loading label="Loading Orders..." />;
  }

  if (isError) {
    return (
      <MessageBox
        title="Error loading orders."
        description={error.message}
        icon={TriangleAlertIcon}
        mode={ConfirmationType.ERROR}
      />
    );
  }

  if (!orders?.length) {
    return (
      <MessageBox
        title="No orders found."
        description={`Sorry, we can't find any orders.`}
        icon={SearchXIcon}
        mode={ConfirmationType.DEFAULT}
      />
    );
  }

  return (
    <div>
      <OrdersDataTable columns={orderColumns} data={orders} />
    </div>
  );
};

export default UserOrders;
