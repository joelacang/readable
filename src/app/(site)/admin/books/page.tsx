import AddBookButton from "~/features/books/components/add-book-button";
import BookLimitSelect from "~/features/books/components/book-limit-select";
import BookList from "~/features/books/components/book-list";
import FilterSidebar from "~/features/books/components/filter-sidebar";
import DashboardPage from "~/features/dashboard/components/dashboard-page";

const BooksAdminPage = () => {
  return (
    <DashboardPage
      title="Books"
      subtitle="Books Admin Page Subtitle Here."
      headerToolbar={<AddBookButton />}
    >
      <div className="flex flex-row gap-8">
        <div className="hidden w-full max-w-xs py-4 xl:block">
          <FilterSidebar />
        </div>

        <div className="flex-1">
          <BookLimitSelect />

          <BookList />
        </div>
      </div>
    </DashboardPage>
  );
};

export default BooksAdminPage;
