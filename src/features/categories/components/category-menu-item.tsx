import type { CategoryDetailType } from "~/types/categories";
import CategoryDropdownMenu from "./category-dropdown-menu";
import { useRouter } from "next/navigation";
import { getLucideIconByName } from "~/utils/get-values";
import { Button } from "~/components/ui/button";

interface Props {
  category: CategoryDetailType;
  isAdmin?: boolean;
}

const CategoryMenuItem = ({ category, isAdmin }: Props) => {
  const router = useRouter();
  const Icon = category.icon ? getLucideIconByName(category.icon) : null;
  const iconColor = category.color;
  return (
    <div className="group relative flex items-center justify-between">
      <Button
        variant="ghost"
        size="sm"
        className="flex flex-1 cursor-pointer flex-row items-center justify-between gap-2"
        onClick={() => {
          if (isAdmin) {
            router.push(`/admin/books?categoryId=${category.id}`);
          } else {
            router.push(`/categories/${category.slug}/`);
          }
        }}
      >
        <div className="flex items-center gap-2">
          {Icon && (
            <Icon className="h-4 w-4" color={category.color ?? "#c2814d"} />
          )}
          <p className="line-clamp-1">{category.name}</p>
        </div>
      </Button>
      {isAdmin && (
        <div className="opacity-0 transition-opacity group-hover:opacity-100">
          <CategoryDropdownMenu category={category} icon={Icon ?? undefined} />
        </div>
      )}
    </div>
  );
};

export default CategoryMenuItem;
