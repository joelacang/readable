import AddCategoryButton from "~/features/categories/components/add-category-button";
import DashboardPage from "~/features/dashboard/components/dashboard-page";

const CategoryAdminPage = () => {
  return (
    <DashboardPage
      title="Categories"
      subtitle="Here are all the categories here"
      headerToolbar={<AddCategoryButton />}
    >
      <div>Content for the category Page</div>
    </DashboardPage>
  );
};

export default CategoryAdminPage;
