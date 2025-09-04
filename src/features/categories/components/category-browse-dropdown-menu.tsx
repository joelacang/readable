import {
  AlertTriangleIcon,
  BookIcon,
  ChevronDownIcon,
  LibraryIcon,
  XIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";
import type { MenuItemType } from "~/types/component";
import { convertCategoriesToMenuItems } from "~/utils/get-values";
import CategoryBrowseDropdownContent from "./category-browse-dropdown-content";

const BrowseCategoryDropdownMenu = () => {
  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = api.category.getCategories.useQuery();
  const router = useRouter();

  const categoryItems: MenuItemType[] = categories
    ? convertCategoriesToMenuItems(categories, router)
    : [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="text-primary hover:text-primary cursor-pointer"
          variant="outline"
        >
          Browse
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 p-2">
        {isLoading ? (
          <div className="space-y-1">
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-full" />
          </div>
        ) : (
          <>
            {isError && (
              <div className="flex flex-col items-center justify-center gap-4 p-2">
                <AlertTriangleIcon className="text-destructive !size-8" />
                <p className="text-destructive text-sm font-medium">
                  Error Loading Categories
                </p>
                <p className="text-destructive text-xs">{error.message}</p>
              </div>
            )}
            {!categories || categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 p-2">
                <AlertTriangleIcon className="!size-8" />
                <p className="text-sm font-medium">No Categories Found.</p>
              </div>
            ) : (
              <>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.push("/books/");
                  }}
                >
                  <LibraryIcon className="text-primary" />
                  <DropdownMenuLabel>Browse All Books</DropdownMenuLabel>
                </DropdownMenuItem>
                <CategoryBrowseDropdownContent items={categoryItems} />
              </>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BrowseCategoryDropdownMenu;
