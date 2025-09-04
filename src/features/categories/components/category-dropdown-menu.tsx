import {
  BookPlusIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import MyDropdownMenuItem from "~/components/my-dropdown-menu-item";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { CategoryDetailType } from "~/types/categories";
import type { MenuItemType } from "~/types/component";
import { useCategoryDialog } from "../hooks/use-category-dialog";
import { useConfirmationAlert } from "~/features/dialogs/hooks/use-confirm-dialog";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";

interface Props {
  category: CategoryDetailType;
  icon?: LucideIcon;
}
const CategoryDropdownMenu = ({ category, icon: Icon }: Props) => {
  const { onOpenSub, onEditCategory } = useCategoryDialog();
  const {
    onOpen: openDeleteConfirmation,
    onError: onDeleteError,
    onPending: onDeletePending,
    onCompleted: onDeleteCompleted,
    onReset: onDeleteReset,
  } = useConfirmationAlert();
  const { mutate: deleteCategory } = api.category.delete.useMutation();
  const utils = api.useUtils();
  const router = useRouter();
  const items: MenuItemType[] = [
    {
      name: "search-books",
      label: `Books in ${category.name}`,
      icon: SearchIcon,
      action: () => {
        router.push(`/admin/books?categoryId=${category.id}`);
      },
    },
    {
      name: "add-subcategory",
      label: "Add Subcategory",
      icon: PlusIcon,
      action: () => onOpenSub(category),
    },
    {
      name: "add-book-in-category",
      label: "Add Book in this Category",
      icon: BookPlusIcon,
      action: () => onOpenSub(category),
    },
    {
      name: "edit-category",
      label: "Edit Category",
      icon: PencilIcon,
      action: () => {
        onEditCategory(category);
      },
    },
    {
      name: "delete-category",
      label: "Delete Category",
      icon: TrashIcon,
      isDestructive: true,
      hasUpperSeparator: true,
      action: () => {
        openDeleteConfirmation({
          title: `Delete ${category.name}?`,
          message: `Are you sure you want to delete the category: ${category.name}? This action is not reversible.`,
          icon: TrashIcon,
          mode: "destructive",
          actionLabel: "Delete",
          action: () => {
            onDeletePending();

            deleteCategory(
              { categoryId: category.id },
              {
                onSuccess: () => {
                  toast.success(`Category Deleted.`);
                  utils.category.getCategories
                    .invalidate()
                    .then(() => console.log("getCategories tag invalidated. "))
                    .catch((error) =>
                      console.error(
                        `Error invalidating getCategories tag`,
                        error,
                      ),
                    );
                  onDeleteReset();
                },
                onError: (error) => {
                  onDeleteError(error.message);
                },
                onSettled: () => {
                  onDeleteCompleted();
                },
              },
            );
          },
          enableConfirmation: true,
        });
      },
    },
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer" asChild>
        <Button className="size-6" variant="ghost" size="icon">
          <MoreHorizontalIcon className="!size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72">
        <DropdownMenuGroup>
          <div className="flex flex-row items-center justify-start px-4">
            {Icon && (
              <Icon className="h-5 w-5" color={category.color ?? "#c2814d"} />
            )}
            <DropdownMenuLabel className="line-clamp-1 text-base font-semibold">
              {category.name}
            </DropdownMenuLabel>
          </div>

          <DropdownMenuSeparator />
        </DropdownMenuGroup>
        {items.map((item) => (
          <MyDropdownMenuItem key={item.name} item={item} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CategoryDropdownMenu;
