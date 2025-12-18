import {
  AlertTriangleIcon,
  BookOpenIcon,
  CalendarIcon,
  ClockIcon,
  GlobeIcon,
  Share2Icon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { ReviewsCard } from "~/features/reviews/components/book-reviews-card";
import type { BookDetail } from "~/types/book";
import AddToCartForm from "~/features/cart/components/add-to-cart-form";
import WishlistToggleButton from "~/features/wishlist/components/wishlist-toggle-button";
import AuthorButton from "~/features/authors/components/author-button";
import { StarRating } from "~/components/star-rating";

interface BookDetailPageProps {
  book: BookDetail;
}

const BookDetailSection = ({ book }: BookDetailPageProps) => {
  const publishedDate = book.publishedDate
    ? new Date(book.publishedDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const readingHours = Math.floor(book.readingTime / 60);
  const readingMinutes = book.readingTime % 60;
  const [coverImage, setCoverImage] = useState<string | null>(
    book.images[0]?.url ?? null,
  );

  return (
    <div className="flex w-full items-center justify-center p-4">
      <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - Book Cover and Gallery */}
        <div className="flex h-fit flex-col items-center justify-center space-y-6 lg:col-span-1">
          {coverImage ? (
            <div className="relative aspect-[1/1.5] w-full max-w-[186px] bg-transparent lg:max-w-[256px]">
              <Image
                fill
                className="object-contain"
                src={coverImage}
                alt="Image"
              />
            </div>
          ) : (
            <div />
          )}

          <div className="flex w-full shrink-0 flex-row flex-wrap items-start justify-start gap-2 rounded-xl border p-3 lg:p-4">
            {book.images.length > 0 && (
              <>
                {book.images.map((image) => (
                  <div
                    key={image.id}
                    className="relative aspect-square w-20 cursor-pointer bg-transparent lg:w-24"
                    onClick={() => setCoverImage(image.url)}
                  >
                    <Image
                      src={image.url}
                      fill
                      className="object-contain"
                      alt={`Image `}
                    />
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Right Column - Book Details */}
        <div className="w-full space-y-6 lg:col-span-2">
          {/* Header Section */}
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl leading-tight font-bold md:text-3xl lg:text-4xl">
                  {book.title}
                </h1>
                {book.subtitle ? (
                  <p className="text-muted-foreground text-sm lg:text-xl">
                    {book.subtitle}
                  </p>
                ) : null}
              </div>
              <div className="ml-4 hidden items-center gap-2 lg:flex">
                <WishlistToggleButton
                  bookId={book.id}
                  bookTitle={book.title}
                  wishlistId={book.wishlistId ?? null}
                />
                <Button variant="outline" size="icon">
                  <Share2Icon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Author and Series */}
            <div className="flex flex-wrap items-center gap-3 text-lg">
              <span>by</span>
              {book.authors.map((author) => (
                <AuthorButton key={author.id} author={author} size="lg" />
              ))}
              {book.series && book.series.length > 0 && (
                <>
                  {book.series.map((series) => (
                    <div key={series.id} className="space-x-2">
                      <span className="text-muted-foreground">•</span>
                      <Link
                        href={series.slug ? `/series/${series.slug}` : ""}
                        className="text-primary hover:underline"
                      >
                        {series.name}
                      </Link>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Rating and Price */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <StarRating
                  value={Math.round(book.rating?.average ?? 0)}
                  disabled
                />
                <span className="text-muted-foreground ml-2 text-lg">
                  (
                  {`${book.rating?.average ?? 0} • with ${book.rating?.totalReviews ?? 0} reviews`}
                  )
                </span>
              </div>
            </div>
          </div>

          <AddToCartForm book={book} mode="page" />

          {/* Categories and Tags */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">Categories:</span>
              {book.categories.map((category) => (
                <Link key={category.id} href={`/categories/${category.id}`}>
                  <Badge
                    variant="secondary"
                    className="hover:bg-primary hover:text-primary-foreground cursor-pointer"
                  >
                    {category.name}
                  </Badge>
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">Tags:</span>
              {book.tags.map((tag) => (
                <Link key={tag.id} href={`/tags/${tag.id}`}>
                  <Badge
                    variant="outline"
                    className="hover:bg-primary hover:text-primary-foreground cursor-pointer"
                  >
                    {tag.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>

          {/* Description */}
          <Card>
            <CardContent>
              <h3 className="mb-3 text-lg font-semibold">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {book.description}
              </p>
            </CardContent>
          </Card>

          {/* Book Details */}
          <Card>
            <CardContent>
              <h3 className="mb-4 text-lg font-semibold">Book Details</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <BookOpenIcon className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm font-medium">Pages:</span>
                    <span className="text-sm">
                      {book.pageCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm font-medium">Reading Time:</span>
                    <span className="text-sm">
                      {readingHours}h {readingMinutes}m
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GlobeIcon className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm font-medium">Language:</span>
                    <span className="text-sm">{book.language}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm font-medium">Published:</span>
                    <span className="text-sm">{publishedDate}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Publisher:</span>
                    <span className="ml-2 text-sm">{book.publisher}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">ISBN:</span>
                    <span className="ml-2 text-sm">{book.isbn}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Word Count:</span>
                    <span className="ml-2 text-sm">
                      {book.wordCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Age Rating:</span>
                    <Badge variant="outline">{book.ageRating}</Badge>
                  </div>
                </div>
              </div>

              {/* Content Warnings */}
              {book.contentWarnings.length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangleIcon className="mt-0.5 h-4 w-4 text-amber-500" />
                    <div>
                      <span className="text-sm font-medium">
                        Content Warnings:
                      </span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {book.contentWarnings.map((warning, index) => (
                          <Badge
                            key={index}
                            variant="destructive"
                            className="text-xs"
                          >
                            {warning}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Keywords */}
          <Card>
            <CardContent>
              <h3 className="mb-3 text-lg font-semibold">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {book.keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <ReviewsCard bookId={book.id} />
        </div>
      </div>
    </div>
  );
};

export default BookDetailSection;
