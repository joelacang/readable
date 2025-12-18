import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
  MoreHorizontalIcon,
  PencilIcon,
  StarIcon,
  StarOffIcon,
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
import type { BookPreview } from "~/types/book";
import { ModeType, type MenuItemType } from "~/types/component";
import { useBookPagination } from "../hooks/use-book-pagination";
import { useRouter } from "next/navigation";
import Toast from "~/components/toast";
import { truncateText } from "~/utils/get-values";
import { useState } from "react";

interface Props {
  book: BookPreview;
}
const BookDropdownMenu = ({ book }: Props) => {
  const [currentFeaturedId, setCurrentFeaturedId] = useState<string | null>(
    book.featuredId ?? null,
  );
  const { mutate: deleteBook, isPending: isDeletingBook } =
    api.book.delete.useMutation();
  const { mutate: addToFeaturedBooks, isPending: isAddingToFeaturedBooks } =
    api.book.addToFeaturedBook.useMutation();
  const {
    mutate: removeFromFeaturedBooks,
    isPending: isRemovingFromFeaturedBooks,
  } = api.book.removeFromFeaturedBook.useMutation();

  const isPending =
    isDeletingBook || isAddingToFeaturedBooks || isRemovingFromFeaturedBooks;
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
      name: "add-to-featured",
      label: "Add To Featured Books",
      icon: StarIcon,
      disabled: isPending,
      hidden: !!currentFeaturedId,
      action: () => {
        const addingToast = toast.loading("Adding To Featured Books...");

        addToFeaturedBooks(
          { bookId: book.id },
          {
            onSuccess: (response) => {
              if (response) {
                setCurrentFeaturedId(response.id);
              }

              toast.custom(() => (
                <Toast
                  title={`${truncateText(book.title, 16)} successfully added to Featured Books.`}
                  mode={ModeType.SUCCESS}
                  footer={<Button>Check Featured Books</Button>}
                />
              ));
            },
            onError: (error) => {
              toast.custom(() => (
                <Toast
                  title="Error adding book to Featured Books"
                  message={error.message}
                  mode={ModeType.ERROR}
                />
              ));
            },
            onSettled: () => {
              toast.dismiss(addingToast);
            },
          },
        );
      },
    },
    {
      name: "remove-from-favorites",
      label: "Remove From Featured Books",
      icon: StarOffIcon,
      disabled: isPending,
      hidden: !currentFeaturedId,
      action: () => {
        const removingToast = toast.loading(`Removing From Featured Books...`);

        removeFromFeaturedBooks(
          { bookId: book.id },
          {
            onSuccess: () => {
              setCurrentFeaturedId(null);
              toast.custom(() => {
                return (
                  <Toast
                    title={`${truncateText(book.title, 16)} removed from Featured Books.`}
                    mode={ModeType.SUCCESS}
                  />
                );
              });
            },
            onError: (error) => (
              <Toast
                title={`Error removing ${truncateText(book.title, 16)} from featured books`}
                message={error.message}
                type={ModeType.ERROR}
              />
            ),
            onSettled: () => {
              toast.dismiss(removingToast);
            },
          },
        );
      },
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
      <DropdownMenuContent className="mx-4 w-72">
        {items.map((item) => (
          <MyDropdownMenuItem key={item.name} item={item} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BookDropdownMenu;
