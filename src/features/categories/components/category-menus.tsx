"use client";
import { TriangleAlertIcon } from "lucide-react";
import MessageBox from "~/components/message-box";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuButton,
} from "~/components/ui/sidebar";
import { Skeleton } from "~/components/ui/skeleton";
import CategoryMenuItem from "~/features/categories/components/category-menu-item";
import { api } from "~/trpc/react";
import { ModeType } from "~/types/component";
import CategoryMenu from "./category-menu";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

interface Props {
  childCategory?: boolean;
}
const CategoryMenus = ({ childCategory = false }: Props) => {
  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = api.category.getCategories.useQuery();
  const router = useRouter();
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");

  if (isLoading) {
    return (
      <div className="space-y-4 px-4">
        <Skeleton className="h-8 w-1/2" />
        <div className="space-y-1 px-2">
          <Skeleton className="h-7 w-full" />
          <Skeleton className="h-7 w-full" />
          <Skeleton className="h-7 w-full" />
          <Skeleton className="h-7 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <MessageBox
        title="Error loading categories."
        description={error.message}
        icon={TriangleAlertIcon}
        mode={ModeType.ERROR}
        isCompact
      />
    );
  }

  if (!categories) return null;

  if (categories.length === 0 && childCategory) {
    return null;
  } else {
    <MessageBox
      title="No categories found."
      description="Sorry, no categories found."
    />;
  }

  return (
    <div>
      <h2 className="px-4 pt-4 text-xl font-semibold">Categories</h2>
      <SidebarGroup>
        <SidebarGroupContent>
          <Button
            size="sm"
            variant="ghost"
            className="flex w-full cursor-pointer items-center justify-start"
            onClick={() => {
              if (isAdminPage) {
                router.push(`/admin/books`);
              } else {
                router.push(`/books`);
              }
            }}
          >
            All Books
          </Button>
          {categories.map((cat) => (
            <CategoryMenu key={cat.id} category={cat} isAdmin={isAdminPage} />
          ))}
        </SidebarGroupContent>
      </SidebarGroup>
    </div>
  );
};

export default CategoryMenus;
