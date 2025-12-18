/* eslint-disable @next/next/no-img-element */
"use client";
import { FlameIcon } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import SectionContainer from "./section-container";
import { api } from "~/trpc/react";
import { QueryStateHandler } from "~/components/query-state-handler";
import { useRouter } from "next/navigation";

const PopularBooks = () => {
  const router = useRouter();
  const {
    data: books,
    isLoading,
    isError,
    error,
  } = api.book.getMostPopularBooks.useQuery();

  return (
    <SectionContainer
      title="Most Popular"
      description="See what everyone's reading - our most popular books based on sales and reader reviews"
      icon={FlameIcon}
      iconColor="bg-rose-500"
      className="bg-secondary/20 w-full"
    >
      <QueryStateHandler
        data={books}
        isLoading={isLoading}
        isError={isError}
        errorTitle="Error Loading Most Popular Books"
        errorMessage={error?.message ?? "An unknown error occurred."}
        loadingLabel="Loading Most Popular Books..."
      >
        {(books) => (
          <div className="flex w-full items-center justify-center">
            <div className="grid w-fit grid-cols-2 gap-8 md:grid-cols-4">
              {books.map((popularBook, index) => (
                <Card
                  key={popularBook.book.id}
                  className="group relative w-44 cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg"
                  onClick={() => router.push(`/books/${popularBook.book.slug}`)}
                >
                  <div className="relative">
                    <div className="from-almond-200 via-almond-500 to-almond-800 absolute top-1 left-2 z-10 rounded-full bg-gradient-to-br px-3 py-2.5 text-xs font-semibold text-white">
                      #{index + 1}
                    </div>
                    <img
                      src={popularBook.book.imagesUrl[0] ?? "/images/book.jpg"}
                      alt={popularBook.book.title}
                      className="h-48 w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-3">
                    <h4 className="text-primary mb-1 line-clamp-2 overflow-hidden text-sm font-bold">
                      {popularBook.book.title}
                    </h4>
                    {popularBook.book.authors.map((author) => (
                      <p
                        className="text-muted-foreground mb-2 text-xs"
                        key={author.id}
                      >
                        {author.name}
                      </p>
                    ))}

                    {/* <div className="mb-2 flex items-center gap-1">
                      <Star className="fill-gold text-gold h-3 w-3" />
                      <span className="text-muted-foreground text-xs">
                        {book.rating}
                      </span>
                    </div> */}

                    {popularBook.book.variants.map((variant, index) => (
                      <div className="text-bookish text-sm" key={index}>
                        <p>
                          {variant.format} -{" "}
                          <span className="font-semibold">
                            ${variant.price}
                          </span>
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </QueryStateHandler>

      <div className="mt-12 text-center">
        <Button
          variant="outline"
          size="lg"
          className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
        >
          View Full Bestsellers List
        </Button>
      </div>
    </SectionContainer>
  );
};

export default PopularBooks;
