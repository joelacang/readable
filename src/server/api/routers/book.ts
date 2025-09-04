import {
  createBookSchema,
  updateBookSchema,
  type BookEditData,
} from "~/zod-schemas/book";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { generateSlug } from "~/utils/get-values";
import z from "zod";
import type { BookDetailType, BookPreviewType } from "~/types/book";
import { getAllDescendantCategoryIds } from "~/server/helpers/category";
import { Decimal } from "@prisma/client/runtime/library";
import type { StoredImageType } from "~/features/storage/hooks/use-temp-images";
import {
  BOOK_RELATION,
  getBookPreview,
  updateRelation,
} from "~/server/helpers/book";

export const bookRouter = createTRPCRouter({
  create: adminProcedure
    .input(createBookSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const results = await ctx.db.$transaction(async (transaction) => {
          const slug = generateSlug(input.title);
          const book = await transaction.book.create({
            data: {
              title: input.title,
              subtitle: input.subtitle,
              description: input.description,
              isbn: input.isbn,
              isbn13: input.isbn13,
              slug,
              language: input.language,
              createdById: ctx.session.user.id,
              publisher: input.publisher,
              publishedDate: input.publishedDate,
              pageCount: input.pageCount,
              wordCount: input.wordCount,
              readingTime: input.readingTime,
              ageRating: input.ageRating ?? "G",
              contentWarnings: input.contentWarnings,
              status: "PUBLISHED",
              metaTitle: input.metaTitle,
              metaDescription: input.metaDescription,
              keywords: input.keywords,
            },
            select: {
              id: true,
            },
          });

          if (input.authors && input.authors.length > 0) {
            await transaction.bookAuthor.createMany({
              data: input.authors.map((author) => ({
                bookId: book.id,
                authorId: author.id,
                createdById: ctx.session.user.id,
              })),
            });
          }

          if (input.categories && input.categories.length > 0) {
            await transaction.bookCategory.createMany({
              data: input.categories.map((category) => ({
                bookId: book.id,
                categoryId: category.id,
                createdById: ctx.session.user.id,
              })),
            });
          }

          if (input.series && input.series.length > 0) {
            await transaction.bookSeries.createMany({
              data: input.series.map((series) => ({
                bookId: book.id,
                seriesId: series.id,
                createdById: ctx.session.user.id,
                seriesOrder: series.order ?? 1,
              })),
            });
          }

          if (input.tags && input.tags.length > 0) {
            await transaction.bookTag.createMany({
              data: input.tags.map((tag) => ({
                bookId: book.id,
                tagId: tag.id,
                createdById: ctx.session.user.id,
              })),
            });
          }

          if (input.variants.length > 0) {
            await transaction.bookVariant.createMany({
              data: input.variants.map((variant) => ({
                bookId: book.id,
                title: variant.title,
                format: variant.format,
                price: new Decimal(variant.price).toFixed(2),
                salePrice: variant.salePrice
                  ? new Decimal(variant.salePrice).toFixed(2)
                  : 0,
                stock: variant.stock ? Math.floor(variant.stock) : 0,
              })),
            });
          }

          const bookConfirmation = await getBookPreview({
            bookId: book.id,
            transaction,
          });

          return bookConfirmation;
        });

        return results;
      } catch (error) {
        console.error("Error creating book", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error creating book.",
          cause: error,
        });
      }
    }),

  update: adminProcedure
    .input(updateBookSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const results = await ctx.db.$transaction(async (t) => {
          const updatedBook = await t.book.update({
            where: { id: input.id },
            data: {
              title: input.title,
              subtitle: input.subtitle,
              description: input.description,
              isbn: input.isbn,
              isbn13: input.isbn13,
              publisher: input.publisher,
              publishedDate: input.publishedDate,
              pageCount: input.pageCount,
              wordCount: input.wordCount,
              readingTime: input.readingTime,
              ageRating: input.ageRating ?? "G",
              contentWarnings: input.contentWarnings,
              metaTitle: input.metaTitle,
              metaDescription: input.metaDescription,
              keywords: input.keywords,
            },
            select: {
              id: true,
              title: true,
              slug: true,
            },
          });

          // Update Authors:
          await updateRelation({
            relation: BOOK_RELATION.AUTHOR,
            transaction: t,
            bookId: updatedBook.id,
            input: input.authors.map((a) => ({ formData: a })),
            loggedUserId: ctx.session.user.id,
          });

          //Update Categories
          await updateRelation({
            relation: BOOK_RELATION.CATEGORY,
            transaction: t,
            bookId: updatedBook.id,
            input: input.categories.map((c) => ({ formData: c })),
            loggedUserId: ctx.session.user.id,
          });

          //Update Tags
          await updateRelation({
            relation: BOOK_RELATION.TAG,
            transaction: t,
            bookId: updatedBook.id,
            input: input.tags.map((t) => ({ formData: t })),
            loggedUserId: ctx.session.user.id,
          });

          //Update Series
          await updateRelation({
            relation: BOOK_RELATION.SERIES,
            transaction: t,
            bookId: updatedBook.id,
            input: input.series.map((s) => ({
              formData: s,
              otherData: { order: s.order },
            })),
            loggedUserId: ctx.session.user.id,
          });

          //Update Variants
          await updateRelation({
            relation: BOOK_RELATION.VARIANT,
            transaction: t,
            bookId: updatedBook.id,
            input: input.variants.map((v) => ({
              formData: {
                id: v.variantId ?? "",
                name: v.title ?? "",
                mode: v.mode,
              },
              otherData: {
                format: v.format,
                description: v.description,
                price: v.price,
                salePrice: v.salePrice,
                stock: v.stock,
              },
            })),
            loggedUserId: ctx.session.user.id,
          });

          const bookConfirmation = await getBookPreview({
            bookId: updatedBook.id,
            transaction: t,
          });

          return bookConfirmation;
        });

        return results;
      } catch (error) {
        console.error("Error updating book", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error updating book.",
          cause: error,
        });
      }
    }),

  delete: adminProcedure
    .input(z.object({ bookId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const book = await ctx.db.book.delete({
        where: { id: input.bookId },
      });

      return book.id;
    }),

  getBookDetailBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      // Simplified Prisma query
      const book = await ctx.db.book.findUnique({
        where: { slug: input.slug },
        select: {
          id: true,
          title: true,
          subtitle: true,
          description: true,
          isbn: true,
          slug: true,
          publisher: true,
          status: true,
          publishedDate: true,
          language: true,
          pageCount: true,
          wordCount: true,
          readingTime: true,
          ageRating: true,
          contentWarnings: true,
          averageRating: true,
          totalRatings: true,
          totalReviews: true,
          keywords: true,
          images: {
            select: {
              image: {
                select: {
                  id: true,
                  url: true,
                  name: true,
                },
              },
            },
          },
          authors: {
            select: {
              author: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
            orderBy: { createAt: "asc" },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              image: true,
              username: true,
            },
          },
          categories: {
            select: {
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },

          series: {
            select: {
              seriesOrder: true,
              series: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                },
              },
            },
            take: 1,
          },

          tags: {
            select: {
              tag: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          variants: {
            select: {
              id: true,
              format: true,
              title: true,
              price: true,
              salePrice: true,
              stock: true,
            },
          },
          reviews: {
            select: {
              id: true,
              rating: true,
              title: true,
              content: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
            take: 5,
          },
          collections: {
            select: {
              collection: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      });

      if (!book) return null;

      const {
        authors,
        tags,
        series,
        categories,
        collections,
        createdBy,
        reviews,
        variants,
        ...others
      } = book;

      const bookDetail: BookDetailType = {
        ...others,
        language: book.language ?? "None",
        authors: authors.map((a) => a.author),
        tags: tags.map((t) => ({ ...t.tag, slug: t.tag.name })),
        series: series.map((s) => ({
          id: s.series.id,
          name: s.series.title,
          slug: s.series.slug,
        })),
        categories: categories.map((c) => c.category),
        createdBy,
        averageRating: others.averageRating?.toNumber() ?? 0,
        collections: collections.map((c) => c.collection),
        reviews,
        variants: variants.map((v) => ({
          ...v,
          price: v.price.toNumber(),
          salePrice: v.salePrice?.toNumber(),
        })),
        images: others.images.map((img) => {
          return {
            id: img.image.id,
            name: img.image.name,
            url: img.image.url,
          };
        }),
      };

      return bookDetail;
    }),

  getBookPreviews: publicProcedure
    .input(
      z.object({
        page: z.number().optional().default(1),
        limit: z.number().optional().default(10),
        categoryId: z.string().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const totalCount = await ctx.db.book.count({
        where: input.categoryId
          ? { categories: { some: { categoryId: input.categoryId } } }
          : undefined,
      });

      const descendantCategoryIds = input.categoryId
        ? await getAllDescendantCategoryIds(input.categoryId)
        : [];

      const categoriesToSearch: string[] = input.categoryId
        ? [input.categoryId, ...descendantCategoryIds]
        : [];

      const booksData = await ctx.db.book.findMany({
        where:
          input.categoryId && categoriesToSearch.length > 0
            ? {
                categories: {
                  some: { categoryId: { in: categoriesToSearch } },
                },
              }
            : {},
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          status: true,
          authors: {
            select: {
              author: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
          categories: {
            select: {
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
          images: {
            select: {
              image: {
                select: {
                  id: true,
                  url: true,
                  name: true,
                },
              },
            },
          },
          variants: {
            select: {
              id: true,
              format: true,
              title: true,
              price: true,
              salePrice: true,
              stock: true,
            },
          },
          ...(ctx.session?.user.id && {
            wishlists: {
              where: {
                userId: ctx.session.user.id,
              },
              select: {
                id: true,
              },
            },
          }),
        },
        orderBy: { title: "asc" },
        skip: (input.page - 1) * input.limit,
        take: input.limit,
      });

      let categoryName: string | null = null;
      if (input.categoryId) {
        const category = await ctx.db.category.findUnique({
          where: { id: input.categoryId },
          select: { name: true },
        });

        categoryName = category?.name ?? null;
      }
      const books: BookPreviewType[] = booksData.map((book) => {
        const {
          authors,
          categories,
          variants,
          images,
          wishlists,
          ...otherFields
        } = book;

        return {
          ...otherFields,
          authors: authors.map((author) => author.author),
          categories: categories.map((category) => category.category),
          images: images.map((image) => image.image),
          variants: variants.map((v) => ({
            id: v.id,
            title: v.title,
            price: v.price.toNumber(),
            salePrice: v.salePrice?.toNumber() ?? null,
            format: v.format,
            stock: v.stock,
          })),
          wishlistId: wishlists?.[0]?.id ?? null,
        } satisfies BookPreviewType;
      });

      return { books, totalCount, categoryName };
    }),

  getBookDataById: adminProcedure
    .input(z.object({ bookId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.book.findUnique({
        where: { id: input.bookId },
        include: {
          authors: {
            select: {
              author: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          categories: {
            select: {
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          series: {
            select: {
              series: {
                select: {
                  id: true,
                  title: true,
                },
              },
              seriesOrder: true,
            },
          },
          tags: {
            select: {
              tag: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          variants: true,
          images: {
            select: {
              image: {
                select: {
                  id: true,
                  name: true,
                  url: true,
                },
              },
            },
          },
        },
      });

      if (!data) return null;

      const {
        authors,
        categories,
        tags,
        variants,
        series,
        images,
        ...otherFields
      } = data;

      const imageRecords: Record<string, StoredImageType> = {};

      if (images.length > 0) {
        for (const img of images) {
          const imageId = img.image.id;

          imageRecords[imageId] ??= {
            ...img.image,
            name: img.image.name ?? "",
          };
        }
      }
      const book: BookEditData = {
        ...otherFields,
        tags: tags.map((t) => {
          return { id: t.tag.id, name: `#${t.tag.name}`, mode: "update" };
        }),
        authors: authors.map((a) => ({ ...a.author, mode: "update" })),
        categories: categories.map((c) => ({ ...c.category, mode: "update" })),
        series: series.map((s) => ({
          id: s.series.id,
          name: s.series.title,
          mode: "update",
          order: s.seriesOrder,
        })),

        variants: variants.map((v) => ({
          variantId: v.id,
          mode: "update",
          title: v.title ?? "",
          format: v.format,
          description: v.description,
          price: v.price.toNumber(),
          salePrice: v.salePrice?.toNumber(),
          stock: v.stock,
        })),

        images: imageRecords,
      };

      return book;
    }),
});
