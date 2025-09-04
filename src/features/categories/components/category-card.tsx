import { Card } from "~/components/ui/card";
import type { CategoryDetailType } from "~/types/categories";
import { getLucideIconByName } from "~/utils/get-values";

interface CategoryCardProps {
  category: CategoryDetailType;
}
const CategoryCard = ({ category }: CategoryCardProps) => {
  const Icon = category.icon ? getLucideIconByName(category.icon) : null;
  return (
    <Card className="group border-secondary cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <div className="p-4 text-center">
        <div
          className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-transform group-hover:scale-110`}
        >
          {Icon && (
            <div
              style={{ backgroundColor: `${category.color ?? "#c2814d"}20` }}
              className="rounded-full p-3"
            >
              <Icon className="!size-8" color={category.color ?? "#c2814d"} />
            </div>
          )}
        </div>
        <h3 className="mb-2 font-semibold">{category.name}</h3>
      </div>
    </Card>
  );
};

export default CategoryCard;
