"use client";
import { PinIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import SectionContainer from "./section-container";
import { api } from "~/trpc/react";
import { QueryStateHandler } from "~/components/query-state-handler";
import BookListItem from "~/features/books/components/book-list-item";
import BookListItemSkeleton from "~/features/books/components/book-list-item-skeleton";

// const featuredBooks = [
//   {
//     id: 1,
//     title: "The Seven Husbands of Evelyn Hugo",
//     author: "Taylor Jenkins Reid",
//     price: 16.99,
//     originalPrice: 24.99,
//     rating: 4.8,
//     reviews: 2840,
//     image:
//       "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
//     badge: "Bestseller",
//   },
//   {
//     id: 2,
//     title: "Atomic Habits",
//     author: "James Clear",
//     price: 18.99,
//     originalPrice: 27.0,
//     rating: 4.9,
//     reviews: 5240,
//     image:
//       "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&h=400&fit=crop",
//     badge: "Editor's Choice",
//   },
//   {
//     id: 3,
//     title: "The Silent Patient",
//     author: "Alex Michaelides",
//     price: 15.99,
//     originalPrice: 22.99,
//     rating: 4.6,
//     reviews: 1890,
//     image:
//       "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
//     badge: "Thriller Hit",
//   },
//   {
//     id: 4,
//     title: "The Silent Patient",
//     author: "Alex Michaelides",
//     price: 15.99,
//     originalPrice: 22.99,
//     rating: 4.6,
//     reviews: 1890,
//     image:
//       "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
//     badge: "Thriller Hit",
//   },
// ];

const FeaturedBooks = () => {
  const {
    data: books,
    isLoading,
    isError,
    error,
  } = api.book.getFeaturedBooks.useQuery();
  return (
    <SectionContainer
      title="Featured Books"
      description="Hand-picked selections from our editors featuring the most captivating reads of the season"
      icon={PinIcon}
      iconColor="bg-purple-500"
    >
      <div className="w-full">
        <QueryStateHandler
          data={books}
          isLoading={isLoading}
          isError={isError}
          loadingLabel={
            <div className="grid gap-2 lg:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <BookListItemSkeleton key={index} />
              ))}
            </div>
          }
          errorTitle="Error Loading Featured Books"
          errorMessage={error ? error.message : "An unknown error occurred."}
          emptyTitle="No Featured Books Found."
          emptyDescription="Featured Books not Found. Please try again later."
        >
          {(books) => (
            <div className="grid gap-2 lg:grid-cols-2">
              {books.map((book) => (
                <BookListItem key={book.id} book={book} />
              ))}
            </div>
          )}
        </QueryStateHandler>

        <div className="mt-12 text-center">
          <Button
            variant="outline"
            size="lg"
            className="border-bookish text-bookish hover:bg-bookish hover:text-white"
          >
            View All Featured Books
          </Button>
        </div>
      </div>
    </SectionContainer>
  );
};

export default FeaturedBooks;
