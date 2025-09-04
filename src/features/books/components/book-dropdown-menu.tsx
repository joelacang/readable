import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
  HeartMinusIcon,
  HeartPlusIcon,
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import MyDropdownMenuItem from "~/components/my-dropdown-menu-item";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
} from "~/components/ui/dropdown-menu";
import { useConfirmationAlert } from "~/features/dialogs/hooks/use-confirm-dialog";
import { api } from "~/trpc/react";
import type { BookPreviewType } from "~/types/book";
import type { MenuItemType } from "~/types/component";
import { useBookPagination } from "../hooks/use-book-pagination";
import { useRouter } from "next/navigation";

interface Props {
  book: BookPreviewType;
}
const BookDropdownMenu = ({ book }: Props) => {
  const { mutate: deleteBook, isPending: isDeletingBook } =
    api.book.delete.useMutation();
  const isPending = isDeletingBook;
  const {
    onOpen: openDeleteConfirmation,
    onError: onDeleteError,
    onPending: onDeletePending,
    onReset: onDeleteReset,
  } = useConfirmationAlert();
  const { onDeleteBook } = useBookPagination();
  const router = useRouter();

  const items: MenuItemType[] = [
    {
      name: "add-to-favorites",
      label: "Add To Favorites",
      icon: HeartPlusIcon,
      disabled: isPending,
    },
    {
      name: "remove-from-favorites",
      label: "Remove From Favorites",
      icon: HeartMinusIcon,
      disabled: isPending,
    },
    {
      name: "edit-book",
      label: "Edit Book",
      icon: PencilIcon,
      disabled: isPending,
      action: () => router.push(`/admin/books/edit?id=${book.id}`),
    },
    {
      name: "delete-book",
      label: "Delete Book",
      icon: TrashIcon,
      isDestructive: true,
      hasUpperSeparator: true,
      disabled: isPending,
      action: () => {
        openDeleteConfirmation({
          title: `Delete ${book.title}?`,
          message: `Are you sure you want to delete the book: ${book.title}? This action is not reversible.`,
          icon: TrashIcon,
          mode: "destructive",
          actionLabel: "Delete",
          action: () => {
            onDeletePending();

            deleteBook(
              { bookId: book.id },
              {
                onSuccess: (response) => {
                  toast.success(`Book Deleted.`);
                  onDeleteBook(response);
                },
                onError: (error) => {
                  onDeleteError(error.message);
                },
                onSettled: () => {
                  onDeleteReset();
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
      <DropdownMenuTrigger asChild>
        <Button className="rounded-full" variant="ghost" size="icon">
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mx-4">
        {items.map((item) => (
          <MyDropdownMenuItem key={item.name} item={item} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BookDropdownMenu;
