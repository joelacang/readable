import type { BookEditData } from "~/zod-schemas/book";
import DashboardHeader from "./dashboard-header";

interface DashboardPageProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  headerToolbar?: React.ReactNode;
}
const DashboardPage = ({
  children,
  title,
  subtitle,
  headerToolbar,
}: DashboardPageProps) => {
  return (
    <div className="flex w-full flex-col p-4">
      <DashboardHeader
        title={title}
        subtitle={subtitle}
        toolbarSection={headerToolbar}
      />
      <div>{children}</div>
    </div>
  );
};

export default DashboardPage;
