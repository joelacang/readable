import { BookIcon, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Badge } from "~/components/ui/badge";
import type { BookPreview } from "~/types/book";
import BookDropdownMenu from "./book-dropdown-menu";
import { Button } from "~/components/ui/button";
import { FaCartPlus } from "react-icons/fa";
import Hint from "~/components/hint";
import { cn } from "~/lib/utils";
import { useIsMobile } from "~/hooks/use-mobile";
import type React from "react";
import WishlistToggleButton from "~/features/wishlist/components/wishlist-toggle-button";
import { useAddToCartDialog } from "~/features/cart/hooks/use-add-to-cart-dialog";
import { StarRating } from "~/components/star-rating";
import AuthorButton from "~/features/authors/components/author-button";

interface Props {
  book: BookPreview;
  isAdmin?: boolean;
  compact?: boolean;
}

const BookListItem = ({ book, isAdmin = false, compact = false }: Props) => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { onAddBook: onAddToCart } = useAddToCartDialog();

  return (
    <div
      className={cn(
        compact
          ? "pointer-events-none gap-4 rounded-lg border px-2 py-4"
          : "gap-4 px-2 py-4 lg:gap-8 lg:p-4",
        "hover:bg-muted/20 active:bg-muted/60 relative flex w-full flex-row items-center justify-center transition-colors",
      )}
    >
      <div
        className={cn(
          compact ? "gap-3" : "gap-4 lg:gap-8",
          "flex w-full flex-1 flex-row items-start justify-start",
        )}
      >
        {/* Book Cover */}
        <div
          className={cn(
            compact ? "size-20" : "size-20 sm:size-32",
            "flex shrink-0 items-center justify-center",
          )}
        >
          {book.images[0] ? (
            <div
              className="relative aspect-square w-full cursor-pointer overflow-hidden"
              onClick={() =>
                router.push(
                  isAdmin ? `/admin/books/${book.slug}` : `/books/${book.slug}`,
                )
              }
            >
              <Image
                fill
                className="object-contain"
                src={book.images.length ? book.images[0].url : ""}
                alt={`${book.title} Cover Image`}
              />
            </div>
          ) : (
            <div className="text-muted-foreground bg-primary/10 flex h-full w-full shrink-0 flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed sm:gap-2">
              <BookIcon className="text-primary size-6 shrink-0 sm:size-8" />
              <p className="text-primary hidden text-xs sm:block">No Cover</p>
            </div>
          )}
        </div>

        {/* Book Information */}
        <div className={cn("min-w-0 flex-1 space-y-1 sm:space-y-2")}>
          {/* Title and Slug */}
          <div>
            <h2
              className={cn(
                compact ? "text-base" : "text-base sm:text-lg",
                "text-primary cursor-pointer leading-tight font-semibold break-words hover:underline hover:underline-offset-2",
              )}
              onClick={() =>
                router.push(
                  isAdmin ? `/admin/books/${book.slug}` : `/books/${book.slug}`,
                )
              }
            >
              {book.title}
            </h2>

            {/* Authors */}

            {book.authors.length > 0 && (
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-muted-foreground text-xs sm:text-sm">
                  by
                </span>
                {book.authors.map((author) => (
                  <AuthorButton key={author.id} author={author} />
                ))}
              </div>
            )}
          </div>

          {/* Categories - Hidden on mobile, shown on tablet+ */}
          {/* Rating  */}
          {book.rating && (
            <div className="flex flex-row items-center justify-start gap-3">
              <StarRating
                value={Math.round(book.rating.average)}
                compact
                disabled
              />
              <p className="text-sm font-medium">
                ({book.rating.totalReviews})
              </p>
            </div>
          )}

          <div className="pb-4">
            {book.categories.length > 0 && !compact && (
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
          </div>

          {/* Description - Hidden on mobile */}
          <>
            {book.description && (
              <p
                className={cn(
                  compact ? "block" : "hidden sm:block",
                  "text-muted-foreground line-clamp-2 text-sm break-words",
                )}
              >
                {book.description}
              </p>
            )}
          </>

          {/* Pricing - Edit with Book Variance */}
          {!compact && (
            <div className="flex flex-col flex-wrap gap-2 pt-3 md:flex-row lg:gap-4">
              {book.variants.map((variant) => (
                <div key={variant.id}>
                  <p className="text-muted-foreground text-sm leading-none font-medium">
                    {variant.format}:&nbsp;&nbsp;
                    <span className="text-primary font-semibold">
                      ${variant.price}
                    </span>
                  </p>
                </div>
              ))}
            </div>
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
      {!compact && (
        <div className={cn(isMobile ? "flex" : "absolute top-4 right-4")}>
          {isAdmin ? (
            <div className="flex flex-row items-center justify-end gap-3">
              <Badge className="bg-muted text-muted-foreground hidden h-full lg:block">
                {book.status}
              </Badge>
              <BookDropdownMenu book={book} />
            </div>
          ) : (
            <div className="space-x-1">
              <WishlistToggleButton
                bookId={book.id}
                bookTitle={book.title}
                wishlistId={book.wishlistId ?? null}
                isCompact
              />
              <Hint label="Add to Cart">
                <Button
                  className="text-primary hover:text-primary size-fit rounded-full p-2"
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onAddToCart(book);
                  }}
                >
                  <FaCartPlus className="!size-4" />
                </Button>
              </Hint>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookListItem;
