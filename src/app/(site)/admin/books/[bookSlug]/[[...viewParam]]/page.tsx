import { useBook } from "~/providers/book-provider";
import DashboardPage from "~/features/dashboard/components/dashboard-page";
import { AdminViewDetails } from "~/utils/get-values";
import BookAdminSwitcher from "~/features/books/components/admin/book-admin-switcher";
import { AdminView } from "~/types/book";
import MessageBox from "~/components/message-box";
import { TriangleAlertIcon } from "lucide-react";
import { ModeType } from "~/types/component";
import { notFound, redirect } from "next/navigation";

interface Props {
  params: Promise<{ bookSlug: string; viewParam?: string[] }>;
}
const BookAdminHomePage = async ({ params }: Props) => {
  const { bookSlug, viewParam } = await params;
  const rawView = viewParam?.[0] ?? "overview";
  const currentView = rawView as AdminView;
  const isValidView = Object.values(AdminView).includes(currentView);

  if (!isValidView) {
    redirect(`/not-found`);
  }

  const viewDetails = AdminViewDetails[currentView];

  return (
    <DashboardPage title={viewDetails.label} subtitle={viewDetails.description}>
      <div className="w-full lg:px-4">
        <BookAdminSwitcher view={currentView} />
      </div>
    </DashboardPage>
  );
};

export default BookAdminHomePage;
