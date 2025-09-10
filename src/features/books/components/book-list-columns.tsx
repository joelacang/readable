"use client";
import { type ColumnDef } from "@tanstack/react-table";
import {
  ArchiveIcon,
  BookIcon,
  CheckIcon,
  CopyIcon,
  EditIcon,
  EyeIcon,
  ImageIcon,
  MoreHorizontalIcon,
  TrashIcon,
} from "lucide-react";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { BookPreview } from "~/types/book";

const BookListColumns: ColumnDef<BookPreview>[] = [
  // Book Details Column (80% responsive width)
  {
    id: "book",
    header: "Book Details",
    meta: {
      className: "w-[80%] min-w-[400px]", // 80% width with minimum width
    },
    cell: ({ row }) => {
      const book = row.original;

      return (
        <div className="flex w-full flex-row items-start justify-start gap-2 pr-4 sm:gap-4">
          {/* Book Cover */}
          <div className="flex size-20 shrink-0 items-center justify-center p-1 sm:size-32 sm:p-2">
            {book.images[0] ? (
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md shadow-md">
                <Image
                  fill
                  className="object-cover"
                  src={book.images[0].url}
                  alt={`${book.title} Cover Image`}
                />
              </div>
            ) : (
              <div className="text-muted-foreground flex h-full w-full shrink-0 flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed sm:gap-2">
                <BookIcon className="size-4 shrink-0 sm:size-8" />
                <p className="hidden text-xs sm:block">No Cover</p>
              </div>
            )}
          </div>

          {/* Book Information */}
          <div className="min-w-0 flex-1 space-y-1 sm:space-y-2">
            {/* Title and Slug */}
            <div>
              <h2 className="text-sm leading-tight font-semibold break-words sm:text-lg">
                {book.title}
              </h2>
              {/* Authors */}
              {book.authors.length > 0 && (
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-muted-foreground text-xs sm:text-sm">
                    by
                  </span>
                  {book.authors.map((author, index) => (
                    <span
                      key={author.id}
                      className="text-xs font-medium sm:text-sm"
                    >
                      {author.name}
                      {index < book.authors.length - 1 && ","}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Categories - Hidden on mobile, shown on tablet+ */}
            {book.categories.length > 0 && (
              <div className="hidden flex-wrap gap-1 md:flex">
                {book.categories.map((category) => (
                  <span
                    key={category.id}
                    className="bg-secondary text-secondary-foreground inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            )}

            {/* Description - Hidden on mobile */}
            {book.description && (
              <p className="text-muted-foreground line-clamp-2 hidden text-sm break-words sm:block">
                {book.description}
              </p>
            )}

            {/* Additional Images Indicator - Compact on mobile */}
            {book.images.length > 1 && (
              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                <ImageIcon className="size-3" />
                <span className="hidden sm:inline">
                  {book.images.length} images
                </span>
                <span className="sm:hidden">+{book.images.length - 1}</span>
              </div>
            )}
          </div>
        </div>
      );
    },
  },

  // Status Column (responsive width)
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    meta: {
      className: "w-[15%] min-w-[100px]", // 15% width with minimum
    },
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <div className="flex justify-center">
          <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium sm:px-2.5`}
          >
            <span className="sm:hidden">{status}</span>
          </span>
        </div>
      );
    },
  },

  // Actions Column (fixed small width)
  {
    id: "actions",
    header: "",
    meta: {
      className: "w-[5%] min-w-[50px]", // Small fixed percentage
    },
    cell: ({ row }) => {
      const book = row.original;

      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => {
                  /* Handle view */
                }}
              >
                <EyeIcon className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  /* Handle edit */
                }}
              >
                <EditIcon className="mr-2 h-4 w-4" />
                Edit Book
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  /* Handle duplicate */
                }}
              >
                <CopyIcon className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {book.status === "DRAFT" && (
                <DropdownMenuItem
                  onClick={() => {
                    /* Handle publish */
                  }}
                >
                  <CheckIcon className="mr-2 h-4 w-4" />
                  Publish
                </DropdownMenuItem>
              )}
              {book.status === "PUBLISHED" && (
                <DropdownMenuItem
                  onClick={() => {
                    /* Handle archive */
                  }}
                >
                  <ArchiveIcon className="mr-2 h-4 w-4" />
                  Archive
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => {
                  /* Handle delete */
                }}
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export default BookListColumns;
