/* eslint-disable @next/next/no-img-element */
"use client";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FlameIcon,
  Star,
} from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import SectionContainer from "./section-container";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const popularBooks = [
  {
    id: 1,
    title: "Fourth Wing",
    author: "Rebecca Yarros",
    price: 19.99,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop",
    rank: 1,
  },
  {
    id: 2,
    title: "Tomorrow, and Tomorrow, and Tomorrow",
    author: "Gabrielle Zevin",
    price: 17.99,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=300&fit=crop",
    rank: 2,
  },
  {
    id: 3,
    title: "Book Lovers",
    author: "Emily Henry",
    price: 16.99,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=300&fit=crop",
    rank: 3,
  },
  {
    id: 4,
    title: "The Thursday Murder Club",
    author: "Richard Osman",
    price: 15.99,
    rating: 4.4,
    image:
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=200&h=300&fit=crop",
    rank: 4,
  },
  {
    id: 5,
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    price: 18.99,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop",
    rank: 5,
  },
  {
    id: 6,
    title: "The Midnight Library",
    author: "Matt Haig",
    price: 16.99,
    rating: 4.3,
    image:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=200&h=300&fit=crop",
    rank: 6,
  },
  {
    id: 7,
    title: "Educated",
    author: "Tara Westover",
    price: 17.99,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=200&h=300&fit=crop",
    rank: 7,
  },
  {
    id: 8,
    title: "The Spanish Love Deception",
    author: "Elena Armas",
    price: 15.99,
    rating: 4.2,
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop",
    rank: 8,
  },
];

const PopularBooks = () => {
  return (
    <SectionContainer
      title="Most Popular"
      description="See what everyone's reading - our most popular books based on sales and reader reviews"
      icon={FlameIcon}
      iconColor="bg-rose-500"
      className="bg-secondary/20"
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {popularBooks.map((book) => (
          <Card
            key={book.id}
            className="group relative cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg"
          >
            <div className="relative">
              <Badge className="bg-burgundy absolute top-2 left-2 z-10 text-xs text-white">
                #{book.rank}
              </Badge>
              <img
                src={book.image}
                alt={book.title}
                className="h-48 w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <CardContent className="p-3">
              <h4 className="text-primary mb-1 line-clamp-2 text-sm font-bold">
                {book.title}
              </h4>
              <p className="text-muted-foreground mb-2 text-xs">
                {book.author}
              </p>

              <div className="mb-2 flex items-center gap-1">
                <Star className="fill-gold text-gold h-3 w-3" />
                <span className="text-muted-foreground text-xs">
                  {book.rating}
                </span>
              </div>

              <div className="text-bookish text-sm font-bold">
                ${book.price}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
