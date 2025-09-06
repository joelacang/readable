"use client";

import { useBook } from "~/providers/book-provider";
import DashboardPage from "~/features/dashboard/components/dashboard-page";
import { AdminViewDetails } from "~/utils/get-values";
import BookAdminSwitcher from "~/features/books/components/admin/book-admin-switcher";

const BookAdminHomePage = () => {
  const { view } = useBook();
  const viewDetails = AdminViewDetails[view];

  return (
    <DashboardPage title={viewDetails.label} subtitle={viewDetails.description}>
      <div className="w-full lg:px-4">
        <BookAdminSwitcher />
      </div>
    </DashboardPage>
  );
};

export default BookAdminHomePage;
