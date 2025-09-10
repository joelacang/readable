import { BookFormat } from "@prisma/client";
import z from "zod";
import { formIdentitySchema } from "~/types/component";
import type { StoredImageType } from "~/features/storage/hooks/use-temp-images";
import type { BookPreview } from "~/types/book";

export const bookVariantSchema = z.object({
  variantId: z.string().cuid().optional(),
  mode: z.enum(["create", "update"]),
  format: z.nativeEnum(BookFormat),
  title: z.string().min(3).max(124).optional(),
  description: z.string().nullable().optional(),
  price: z.coerce.number(),
  salePrice: z.coerce.number().nullable().optional(),
  stock: z.coerce.number().nullable().optional(),
});

// Zod Schema
export const createBookSchema = z.object({
  // Basic Information
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  subtitle: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  isbn: z
    .string()
    .nullable()
    .optional()
    .refine((val) => !val || /^[0-9\-X]{10,17}$/.test(val), {
      message: "Invalid ISBN format",
    }),
  isbn13: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || /^[0-9\-]{13,17}$/.test(val), {
      message: "Invalid ISBN-13 format",
    }),
  publisher: z.string().nullable().optional(),
  publishedDate: z.date().nullable().optional(),
  pageCount: z.coerce.number().int().optional(),
  wordCount: z.coerce.number().int().optional(),
  readingTime: z.coerce.number().int().optional(),
  language: z.string().nullable().optional(),
  ageRating: z.string().nullable().optional(),
  contentWarnings: z.array(z.string()), // File Information
  metaTitle: z
    .string()
    .max(60, "Meta title should be less than 60 characters")
    .nullable()
    .optional(),
  metaDescription: z
    .string()
    .max(350, "Meta description should be less than 160 characters")
    .nullable()
    .optional(),
  keywords: z.array(z.string()),
  tags: z.array(formIdentitySchema), // Relations (simplified for form)
  authors: z.array(formIdentitySchema),
  categories: z.array(formIdentitySchema),
  series: z.array(
    formIdentitySchema.merge(
      z.object({ order: z.number().nullable().optional() }),
    ),
  ),
  variants: z
    .array(bookVariantSchema)
    .min(1, { message: "At least one book variant is required." }),
});

export type BookFormData = z.infer<typeof createBookSchema>;

export const updateBookSchema = createBookSchema.merge(
  z.object({
    id: z.string().cuid(),
  }),
);

type BookEditRawData = z.infer<typeof updateBookSchema>;

export type BookEditData = BookEditRawData & {
  images: Record<string, StoredImageType>;
};
export const bookSeriesSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
  authors: z.array(formIdentitySchema), // handled separately via AuthorSeries
});

export type SeriesFormData = z.infer<typeof bookSeriesSchema>;

export const createAddToCartSchema = (book: BookPreview) => {
  return z
    .object({
      variantId: z.string().cuid("Please choose a format"),
      quantity: z.coerce
        .number()
        .refine((val) => Number.isInteger(val), {
          message: "Quantity must be a whole number",
        })
        .optional(),
    })
    .superRefine((data, ctx) => {
      // Find variant from the form data using the book parameter
      const variant = book.variants.find((v) => v.id === data.variantId);

      if (variant && variant.format !== "Digital" && !data.quantity) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["quantity"],
          message: `Quantity is required for ${variant.format}.`,
        });
      }

      // Set default quantity for digital books
      if (variant && variant.format === "Digital" && !data.quantity) {
        data.quantity = 1;
      }

      if (variant && variant.format !== "Digital" && data.quantity) {
        const stock = variant.stock;

        if (typeof stock === "number") {
          if (stock <= 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["quantity"],
              message: "This item is currently out of stock",
            });
          } else if (data.quantity > stock) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["quantity"],
              message:
                stock === 1
                  ? "Only 1 item available in stock"
                  : `Quantity you entered is more than the available stock.`,
            });
          }
        }
      }
    });
};
