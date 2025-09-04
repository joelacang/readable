import FilterSidebar from "~/features/books/components/filter-sidebar";
import CategoryMenus from "~/features/categories/components/category-menus";
import CategoryDetail from "./category-detail";

interface Props {
  params: Promise<{ categorySlug: string }>;
}
const BooksByCategoryPage = async ({ params }: Props) => {
  const { categorySlug } = await params;

  return (
    <div className="flex w-full flex-row gap-4">
      <div className="hidden w-full max-w-xs py-4 xl:block">
        <FilterSidebar />
      </div>
      <div className="flex w-full flex-col p-4 lg:p-8">
        <CategoryDetail slug={categorySlug} />
      </div>
    </div>
  );
};

export default BooksByCategoryPage;
