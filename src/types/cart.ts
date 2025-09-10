import type { BookFormat } from "@prisma/client";
import type { BookSummary } from "./book";

export type CartType = {
  id: string;
  items: CartItemsType[];
};

export type CartItemsType = {
  id: string;
  book: BookSummary;
  variant: {
    id: string;
    format: BookFormat;
    price: number;
    stock: number;
  };
  quantity: number;
};
