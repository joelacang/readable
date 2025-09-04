import type { CategoryDetailType } from "~/types/categories";
import CategoryMenuItem from "./category-menu-item";

interface Props {
  category: CategoryDetailType;
  isAdmin?: boolean;
}
const CategoryMenu = ({ category, isAdmin = false }: Props) => {
  return (
    <div>
      <CategoryMenuItem category={category} isAdmin={isAdmin} />
      {category.subCategories.length > 0 && (
        <div className="pl-4">
          {category.subCategories.map((sub) => (
            <CategoryMenu key={sub.id} category={sub} isAdmin={isAdmin} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryMenu;
