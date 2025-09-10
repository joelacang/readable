import { DollarSignIcon, PackageIcon, StarIcon } from "lucide-react";
import { QueryStateHandler } from "~/components/query-state-handler";
import DashboardCard from "~/features/dashboard/components/dashboard-card";
import { api } from "~/trpc/react";
import BookMonthlySalesChart from "./book-monthly-chart";

interface Props {
  bookId: string;
}

const BookOverview = ({ bookId }: Props) => {
  const {
    data: stats,
    isLoading,
    isError,
    error,
  } = api.book.getBookDashboardStats.useQuery({ bookId });

  console.log(`results:`, stats ?? "");
  return (
    <div>
      <QueryStateHandler
        data={stats}
        isLoading={isLoading}
        isError={isError}
        loadingLabel={`Loading Dashboard Stats...`}
        errorMessage={error?.message ?? "An unknown error occurred"}
      >
        {(stats) => (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <DashboardCard
                title="Total Sales"
                icon={DollarSignIcon}
                content={`$${stats.totalSales}`}
              />
              <DashboardCard
                title="Books Sold"
                icon={PackageIcon}
                content={`${stats.totalUnitsSold}`}
              />
              <DashboardCard
                title="Avg. Rating"
                icon={StarIcon}
                content={stats.averageRating.toString()}
                subtitle={`Based on ${stats.totalReviews} reviews`}
              />
              <DashboardCard
                title="Stock Level"
                icon={DollarSignIcon}
                content={`${stats.totalStocks}`}
              />
            </div>
            <BookMonthlySalesChart
              data={stats.monthlyPerformance.map((m) => ({
                month: m.month,
                revenue: Number(m.revenue),
                units: Number(m.units_sold),
              }))}
            />
          </div>
        )}
      </QueryStateHandler>
    </div>
  );
};

export default BookOverview;
