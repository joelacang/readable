"use client";

import SectionContainer from "./section-container";
import { ListIcon } from "lucide-react";
import { api } from "~/trpc/react";
import CategoryCard from "~/features/categories/components/category-card";
import { Button } from "~/components/ui/button";

const CategorySection = () => {
  const {
    data: categories,
    isPending,
    isError,
    error,
  } = api.category.getCategories.useQuery();

  return (
    <SectionContainer
      icon={ListIcon}
      title="Explore Categories"
      description="Discover your next favorite book from our carefully curated collection spanning every category"
      iconColor="bg-teal-500"
    >
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4">
        {categories?.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button
          variant="outline"
          className="hover:bg-primary border-primary cursor-pointer hover:text-white"
        >
          View All Categories
        </Button>
      </div>
    </SectionContainer>
  );
};

export default CategorySection;
