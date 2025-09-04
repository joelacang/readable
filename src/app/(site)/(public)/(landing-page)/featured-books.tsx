/* eslint-disable @next/next/no-img-element */
import { Star, ShoppingCart, Heart, PinIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import SectionContainer from "./section-container";

const featuredBooks = [
  {
    id: 1,
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    price: 16.99,
    originalPrice: 24.99,
    rating: 4.8,
    reviews: 2840,
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
    badge: "Bestseller",
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    price: 18.99,
    originalPrice: 27.0,
    rating: 4.9,
    reviews: 5240,
    image:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&h=400&fit=crop",
    badge: "Editor's Choice",
  },
  {
    id: 3,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    price: 15.99,
    originalPrice: 22.99,
    rating: 4.6,
    reviews: 1890,
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
    badge: "Thriller Hit",
  },
  {
    id: 4,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    price: 15.99,
    originalPrice: 22.99,
    rating: 4.6,
    reviews: 1890,
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
    badge: "Thriller Hit",
  },
];

const FeaturedBooks = () => {
  return (
    <SectionContainer
      title="Featured Books"
      description="Hand-picked selections from our editors featuring the most captivating reads of the season"
      icon={PinIcon}
      iconColor="bg-purple-500"
    >
      <div>
        <div className="grid gap-8 lg:grid-cols-2">
          {featuredBooks.map((book) => (
            <Card
              key={book.id}
              className="group flex overflow-hidden py-3 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-row items-start justify-start gap-6 p-3">
                <div className="relative flex flex-shrink-0">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-bookish absolute top-4 right-4 bg-white/80 hover:bg-white"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                <div className="w-full">
                  <Badge className="bg-amber-500">{book.badge}</Badge>
                  <h3 className="text-primary mb-2 line-clamp-2 text-xl font-bold">
                    {book.title}
                  </h3>
                  <p className="text-muted-foreground mb-3">by {book.author}</p>

                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array<string>(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(book.rating)
                              ? "fill-gold text-gold"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {book.rating} ({book.reviews} reviews)
                    </span>
                  </div>

                  <div className="mb-4 flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-secondary text-2xl font-bold">
                        ${book.price}
                      </span>
                      <span className="text-muted-foreground text-sm line-through">
                        ${book.originalPrice}
                      </span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      {Math.round(
                        ((book.originalPrice - book.price) /
                          book.originalPrice) *
                          100,
                      )}
                      % off
                    </Badge>
                  </div>

                  <Button
                    className="bg-bookish hover:bg-bookish/90 text-primary w-full"
                    variant="outline"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

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
