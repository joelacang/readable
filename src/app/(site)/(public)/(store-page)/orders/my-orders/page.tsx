import UserOrders from "~/features/orders/user-orders";
import PageHeader from "~/features/page/components/page-header";

const MyOrdersPage = () => {
  return (
    <div>
      <PageHeader
        title="My Orders"
        description="Track and manage your orders."
      />
      <div>
        <UserOrders />
      </div>
    </div>
  );
};

export default MyOrdersPage;
