import type { BookFormat, BookStatus } from "@prisma/client";
import type { AgeRating, LinkDetailType } from "./component";

export type BookDetail = {
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
  variants: BookVariant[];
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

export type BookPreview = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  status: BookStatus;
  authors: LinkDetailType[];
  categories: LinkDetailType[];
  images: { id: string; url: string }[];
  variants: BookVariant[];
  wishlistId?: string | null;
};

export type BookConfirmDetails = {
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

export type BookVariant = {
  id: string;
  title: string | null;
  format: BookFormat;
  price: number;
  salePrice?: number | null;
  stock?: number | null;
};

export type BookSummary = {
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

export type MonthlySalesData = {
  month: string; // e.g., "2025-09"
  revenue: string; // returned as string because subTotal is Decimal
  units_sold: number;
};

export type BookStats = {
  bookId: string;
  totalSales: number;
  totalUnitsSold: number;
  totalReviews: number;
  averageRating: number;
  totalStocks: number;
  monthlyPerformance: MonthlySalesData[];
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

export enum UserView {
  HOME = "home",
  LIBRARY = "library",
  READLIST = "readlist",
  ORDERS = "orders",
  REVIEWS = "reviews",
  SETTINGS = "settings",
}
