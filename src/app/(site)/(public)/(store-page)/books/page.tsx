import PageHeader from "~/features/page/components/page-header";
import BookList from "~/features/books/components/book-list";
import FilterSidebar from "~/features/books/components/filter-sidebar";

const BookStoreHomePage = () => {
  return (
    <div className="flex w-full flex-row gap-4">
      <div className="hidden w-full max-w-xs py-4 xl:block">
        <FilterSidebar />
      </div>
      <div className="flex w-full flex-col gap-4 p-4 lg:p-8">
        <PageHeader
          title="All Books"
          description="Browse books from various categories here."
        />
        <BookList />
      </div>
    </div>
  );
};

export default BookStoreHomePage;
