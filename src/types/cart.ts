import type { BookFormat } from "@prisma/client";
import type { BookSummaryType } from "./book";

export type CartType = {
  id: string;
  items: CartItemsType[];
};

export type CartItemsType = {
  id: string;
  book: BookSummaryType;
  variant: {
    id: string;
    format: BookFormat;
    price: number;
    stock: number;
  };
  quantity: number;
};
