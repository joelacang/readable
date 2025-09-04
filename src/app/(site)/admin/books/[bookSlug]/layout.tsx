"use client";

import BookAdminHeader from "~/features/books/components/admin/header";
import BookAdminSidebar from "~/features/books/components/admin/sidebar";
import BookAdminViewSelect from "~/features/books/components/admin/view-select";
import { BookProvider } from "~/providers/book-provider";

interface Props {
  children: React.ReactNode;
}

const BookAdminLayoutPage = ({ children }: Props) => {
  return (
    <BookProvider>
      <div className="flex h-[calc(100vh-124px)] flex-col">
        <BookAdminHeader />
        <div className="flex h-full flex-1">
          <div className="hidden xl:flex">
            <BookAdminSidebar />
          </div>
          <div className="h-full w-full overflow-y-auto">
            <BookAdminViewSelect />
            {children}
          </div>
        </div>
      </div>
    </BookProvider>
  );
};

export default BookAdminLayoutPage;
