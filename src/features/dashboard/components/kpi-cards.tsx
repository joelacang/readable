import {
  DollarSignIcon,
  PackageIcon,
  RefreshCwIcon,
  ShoppingCartIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react";
import type { KPI, KPIResults } from "~/types/component";
import { currencyFormatter } from "~/utils/get-values";
import DashboardKPICard from "./dashboard-kpi-card";

interface Props {
  results: KPIResults;
}

const KPICards = ({ results }: Props) => {
  const kpis: KPI[] = [
    {
      id: "total_sales",
      label: "Total Sales",
      subtitle: "Last 30 days",
      trending: "up",
      icon: DollarSignIcon,
      color: "#10B981", // emerald-500
      value: currencyFormatter(results.revenue),
    },
    {
      id: "orders",
      label: "Orders",
      subtitle: "Completed orders",
      trending: "up",
      icon: ShoppingCartIcon,
      color: "#3B82F6", // blue-500
      value: results.orders.toString(),
    },
    {
      id: "customers",
      label: "New Customers",
      subtitle: "Last 30 days",
      trending: "down",
      icon: UsersIcon,
      color: "#F59E0B", // amber-500
      value: results.newCustomers.toString(),
    },
    {
      id: "books-sold",
      label: "Books Sold",
      subtitle: "Live in store",
      trending: "up",
      icon: PackageIcon,
      color: "#6366F1", // indigo-500
      value: results.booksSold.toString(),
    },
    {
      id: "reviews",
      label: "New Reviews",
      subtitle: "Last 30 days",
      trending: "up",
      icon: StarIcon,
      color: "#FBBF24", // yellow-400
      value: results.newReviews.toString(),
    },
    {
      id: "returns",
      label: "Returns",
      subtitle: "Requested by customers",
      trending: "down",
      icon: RefreshCwIcon,
      color: "#EF4444", // red-500
      value: results.returns.toString(),
    },
  ];
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {kpis.map((kpi, index) => (
        <DashboardKPICard key={index} kpi={kpi} />
      ))}
    </div>
  );
};

export default KPICards;
