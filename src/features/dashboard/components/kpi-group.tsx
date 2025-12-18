import {
  DollarSignIcon,
  PackageIcon,
  RefreshCwIcon,
  ShoppingCartIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react";
import { type DateRange, type KPI } from "~/types/component";
import { api } from "~/trpc/react";
import KPICardSkeleton from "./kpi-card-skeleton";
import { QueryStateHandler } from "~/components/query-state-handler";
import KPICards from "./kpi-cards";

export const kpis: KPI[] = [
  {
    id: "total_sales",
    label: "Total Sales",
    subtitle: "Last 30 days",
    trending: "up",
    icon: DollarSignIcon,
    color: "#10B981", // emerald-500
    value: "$82,450",
  },
  {
    id: "orders",
    label: "Orders",
    subtitle: "Completed orders",
    trending: "up",
    icon: ShoppingCartIcon,
    color: "#3B82F6", // blue-500
    value: "1,247",
  },
  {
    id: "customers",
    label: "New Customers",
    subtitle: "Last 30 days",
    trending: "down",
    icon: UsersIcon,
    color: "#F59E0B", // amber-500
    value: "326",
  },
  {
    id: "products",
    label: "Active Products",
    subtitle: "Live in store",
    trending: "up",
    icon: PackageIcon,
    color: "#6366F1", // indigo-500
    value: "148",
  },
  {
    id: "reviews",
    label: "New Reviews",
    subtitle: "Last 30 days",
    trending: "up",
    icon: StarIcon,
    color: "#FBBF24", // yellow-400
    value: "89",
  },
  {
    id: "returns",
    label: "Returns",
    subtitle: "Requested by customers",
    trending: "down",
    icon: RefreshCwIcon,
    color: "#EF4444", // red-500
    value: "21",
  },
];

interface Props {
  range: DateRange;
}
const KPIGroup = ({ range }: Props) => {
  const {
    data: kpis,
    isLoading,
    isError,
  } = api.dashboard.getKPIs.useQuery({ range });
  return (
    <QueryStateHandler
      data={kpis}
      isLoading={isLoading}
      isError={isError}
      loadingLabel={
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <KPICardSkeleton key={index} />
          ))}
        </div>
      }
    >
      {(kpis) => <KPICards results={kpis} />}
    </QueryStateHandler>
  );
};

export default KPIGroup;
