import type { BookFormat, BookStatus } from "@prisma/client";
import type { AgeRating, LinkDetailType } from "./component";

export type BookDetailType = {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  isbn?: string | null;
  slug: string;
  status: BookStatus;

  // Book Info
  publisher?: string | null;
  publishedDate?: Date | null;
  language: string;
  pageCount: number;
  wordCount: number;
  readingTime: number;
  ageRating: string;
  contentWarnings: string[];

  // Media
  images: { id: string; url: string }[];

  // Ratings
  averageRating: number;
  totalRatings: number;
  totalReviews: number;

  // SEO
  keywords: string[];

  createdBy: {
    id: string;
    username?: string | null;
    image?: string | null;
    name: string | null;
  } | null;
  // Relations (flattened)
  authors: LinkDetailType[];
  categories: LinkDetailType[];
  series: LinkDetailType[];
  tags: LinkDetailType[];
  variants: BookVariantType[];
  reviews: Array<{
    id: string;
    rating: number;
    title: string | null;
    content: string | null;
    comment?: string;
    createdAt: Date;
    user: {
      id: string;
      name: string | null;
      image?: string | null;
    };
  }>;
  collections: LinkDetailType[];
  wishlistId?: string | null;
};

export type BookPreviewType = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  status: BookStatus;
  authors: LinkDetailType[];
  categories: LinkDetailType[];
  images: { id: string; url: string }[];
  variants: BookVariantType[];
  wishlistId?: string | null;
};

export type BookConfirmDetailsType = {
  id: string;
  title: string;
  description?: string | null;
  slug: string;
  imageUrl?: string | null;
  authors: LinkDetailType[];
  categories: LinkDetailType[];
  variants: {
    id: string;
    title: string | null;
    format: BookFormat;
    price: number;
    salePrice: number;
  }[];
};

export type BookVariantType = {
  id: string;
  title: string | null;
  format: BookFormat;
  price: number;
  salePrice?: number | null;
  stock?: number | null;
};

export type BookSummaryType = {
  id: string;
  slug: string;
  title: string;
  imagesUrl: string[];
  authors: {
    id: string;
    name: string;
    slug: string;
  }[];
};

export enum AdminView {
  OVERVIEW = "overview",
  DETAILS = "details",
  ANALYTICS = "analytics",
  ORDERS = "orders",
  INVENTORY = "inventory",
  REVIEWS = "reviews",
  PRICING = "pricing",
  SETTINGS = "settings",
}
