import {
  createBookSchema,
  updateBookSchema,
  type BookEditData,
} from "~/zod-schemas/book";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { generateSlug } from "~/utils/get-values";
import z from "zod";
import type {
  BookDetail,
  BookPreview,
  BookStats,
  BookSummary,
} from "~/types/book";
import { getAllDescendantCategoryIds } from "~/server/helpers/category";
import { Decimal } from "@prisma/client/runtime/library";
import type { StoredImageType } from "~/features/storage/hooks/use-temp-images";
import {
  BOOK_RELATION,
  bookPreviewPrismaSelection,
  convertToBookPreviewType,
  getBookPreview,
  isFeaturedActive,
  updateRelation,
} from "~/server/helpers/book";
import { getBookRating } from "~/server/helpers/review";
import { addDays } from "date-fns";
import type { GroupedSalesUnits } from "~/types/order";

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
      });

      if (!book) return null;

      const {
        authors,
        tags,
        series,
        categories,
        collections,
        createdBy,
        variants,
        wishlists,
        ...others
      } = book;

      const rating = await getBookRating({ bookId: book.id });

      const bookDetail: BookDetail = {
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
        wishlistId: wishlists[0]?.id,
        rating,
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
          ...bookPreviewPrismaSelection,
          featuredBooks: {
            where: {
              expiresAt: {
                gt: new Date(),
              },
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

      const books: BookPreview[] = await Promise.all(
        booksData.map(async (book) => {
          const bookPreview = await convertToBookPreviewType({
            rawData: book,
            showRating: true,
          });

          return {
            ...bookPreview,
            wishlistId: book.wishlists?.[0]?.id ?? null,
            featuredId: book.featuredBooks.map((f) => f.id)?.[0],
          } satisfies BookPreview;
        }),
      );

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

  searchBook: publicProcedure
    .input(z.object({ searchValue: z.string() }))
    .query(async ({ ctx, input }) => {
      const results = await ctx.db.book.findMany({
        where: {
          title: {
            contains: input.searchValue,
            mode: "insensitive",
          },
        },
        select: bookPreviewPrismaSelection,
      });

      const books: BookPreview[] = await Promise.all(
        results.map((book) => {
          return convertToBookPreviewType({ rawData: book });
        }),
      );

      return books;
    }),

  getMostPopularBooks: publicProcedure.query(async ({ ctx }) => {
    const popularBooks = await ctx.db.orderItem.groupBy({
      by: ["bookId"],
      where: {
        order: {
          status: {
            in: ["PAID", "DELIVERED"],
          },
        },
      },
      _count: {
        bookId: true,
      },
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 8,
    });

    const bookIds = popularBooks
      .map((b) => b.bookId)
      .filter((id) => id !== null);

    const books = await ctx.db.book.findMany({
      where: {
        id: {
          in: bookIds,
        },
      },
      select: {
        id: true,
        slug: true,
        title: true,
        images: {
          select: {
            image: true,
          },
        },
        authors: {
          select: {
            author: true,
          },
        },
        variants: true,
      },
    });

    const booksWithCountsOrdered = bookIds
      .map((id) => {
        const book = books.find((b) => b.id === id);
        const sold =
          popularBooks.find((b) => b.bookId === id)?._sum.quantity ?? 0;

        if (!book) return null;

        const { authors, images, variants, ...otherFields } = book;

        return {
          book: {
            ...otherFields,
            authors: authors.map((a) => ({
              id: a.author.id,
              name: a.author.name,
              slug: a.author.slug,
            })),
            imagesUrl: images.map((i) => i.image.url),
            variants: variants.map((v) => ({
              format: v.format,
              price: v.price.toNumber(),
            })),
          },
          totalSold: sold,
        };
      })
      .filter((b) => b !== null);

    return booksWithCountsOrdered satisfies {
      book: BookSummary;
      totalSold: number;
    }[];
  }),

  getBookDashboardStats: adminProcedure
    .input(z.object({ bookId: z.string() }))
    .query(async ({ ctx, input }) => {
      const orderStats = await ctx.db.orderItem.aggregate({
        where: {
          bookId: input.bookId,
          order: { status: { in: ["PAID", "DELIVERED", "IN_TRANSIT"] } },
        },
        _sum: {
          subTotal: true,
          quantity: true,
        },
      });

      const ratingStats = await getBookRating({ bookId: input.bookId });

      const totalStock = await ctx.db.bookVariant.aggregate({
        where: { bookId: input.bookId },
        _sum: {
          stock: true,
        },
      });

      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5); // Include current month, so 5 months before

      const salesByMonth = await ctx.db.$queryRaw<GroupedSalesUnits[]>`
WITH months AS (
  SELECT to_char(date_trunc('month', CURRENT_DATE) - (interval '1 month' * generate_series(0, 5)), 'YYYY-MM') AS period
)
SELECT
  months.period,
  COALESCE(SUM(o."subTotal"), 0) AS revenue,
  COALESCE(SUM(o."quantity")::INT, 0) AS units
FROM months
LEFT JOIN "OrderItem" o
  ON to_char(date_trunc('month', o."createdAt"), 'YYYY-MM') = months.period
  AND o."bookId" = ${input.bookId}
GROUP BY months.period
ORDER BY months.period;
`;

      return {
        bookId: input.bookId,
        totalSales: orderStats._sum.subTotal?.toNumber() ?? 0,
        totalUnitsSold: orderStats._sum.quantity ?? 0,
        totalReviews: ratingStats.totalReviews,
        averageRating: ratingStats.average,
        totalStocks: totalStock._sum.stock ?? 0,
        monthlyPerformance: salesByMonth,
      } satisfies BookStats;
    }),

  addToFeaturedBook: adminProcedure
    .input(z.object({ bookId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const results = await ctx.db.$transaction(async (tx) => {
        try {
          const activeFeatured = await isFeaturedActive({
            bookId: input.bookId,
            transaction: tx,
          });

          if (activeFeatured.isActive && activeFeatured.featuredId) {
            // Already active — do nothing or return
            return null;
          }

          if (!activeFeatured.isActive && activeFeatured.featuredId) {
            // Expired, but record exists — update its expiresAt
            const updated = await tx.featuredBook.update({
              where: { id: activeFeatured.featuredId },
              data: {
                expiresAt: addDays(new Date(), 60),
              },
            });

            return updated;
          }

          const featuredBook = await tx.featuredBook.create({
            data: {
              bookId: input.bookId,
              addedById: ctx.session.user.id,
              expiresAt: addDays(new Date(), 60),
            },
          });

          return featuredBook;
        } catch (error) {
          console.error(`Unable to add to featured books`, error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Unable to add book to Featured Books",
            cause: error,
          });
        }
      });

      return results;
    }),

  removeFromFeaturedBook: adminProcedure
    .input(z.object({ bookId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const results = await ctx.db.$transaction(async (tx) => {
          const activeFeatured = await isFeaturedActive({
            bookId: input.bookId,
            transaction: tx,
          });

          if (!activeFeatured.featuredId)
            throw new TRPCError({
              code: "UNPROCESSABLE_CONTENT",
              message: "Book is not featured.",
            });

          const deletedFeatured = await tx.featuredBook.delete({
            where: {
              id: activeFeatured.featuredId,
            },
          });

          return deletedFeatured;
        });

        return results;
      } catch (error) {
        console.error("Unable to remove from featured books", error);
        throw new TRPCError({
          code: "UNPROCESSABLE_CONTENT",
          message: "Error removing from featured books.",
          cause: error,
        });
      }
    }),

  getFeaturedBooks: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.featuredBook.findMany({
      where: { expiresAt: { gt: new Date() } },
      select: {
        id: true,
        book: {
          select: bookPreviewPrismaSelection,
        },
      },
    });

    const featuredBooks: BookPreview[] = await Promise.all(
      data.map(async (rawData) => {
        const bookPreview: BookPreview = await convertToBookPreviewType({
          rawData: rawData.book,
          showRating: true,
        });

        return bookPreview;
      }),
    );

    return featuredBooks;
  }),
});
