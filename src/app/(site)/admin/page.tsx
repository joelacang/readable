import DashboardPage from "~/features/dashboard/components/dashboard-page";
import KPISection from "~/features/dashboard/components/kpi-section";
import QuickActions from "~/features/dashboard/components/quick-actions";
import RecentActivity from "~/features/dashboard/components/recent-activity";

const AdminDashboardPage = () => {
  return (
    <DashboardPage
      title="Welcome, Joe"
      subtitle="Here's what's happening today."
    >
      <div className="flex w-full flex-col gap-8 xl:flex-row">
        <div className="flex-1">
          {/* KPI Sections */}
          <KPISection />
        </div>
        <div className="flex w-full flex-col gap-8 xl:max-w-sm">
          <QuickActions />
          <RecentActivity />
        </div>
      </div>
    </DashboardPage>
  );
};

export default AdminDashboardPage;
