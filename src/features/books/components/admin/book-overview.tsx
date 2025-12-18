import { DollarSignIcon, PackageIcon, StarIcon } from "lucide-react";
import { QueryStateHandler } from "~/components/query-state-handler";
import DashboardKPICard from "~/features/dashboard/components/dashboard-kpi-card";
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
              <DashboardKPICard
                kpi={{
                  id: "total-sales",
                  label: "Total Sales",
                  icon: DollarSignIcon,
                  value: `$${stats.totalSales}`,
                }}
              />
              <DashboardKPICard
                kpi={{
                  id: "books-sold",
                  label: "Books Sold",
                  icon: PackageIcon,
                  value: stats.totalUnitsSold.toString(),
                }}
              />

              <DashboardKPICard
                kpi={{
                  id: "avg-rating",
                  label: "Average Rating",
                  icon: StarIcon,
                  value: stats.totalReviews.toString(),
                }}
              />
              <DashboardKPICard
                kpi={{
                  id: "total-stocks",
                  label: "Total STocks",
                  icon: PackageIcon,
                  value: stats.totalStocks.toString(),
                }}
              />
            </div>
            <BookMonthlySalesChart data={stats.monthlyPerformance} />
          </div>
        )}
      </QueryStateHandler>
    </div>
  );
};

export default BookOverview;
