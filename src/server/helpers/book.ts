import type { BookFormat, Prisma } from "@prisma/client";
import type { BookPreviewType } from "~/types/book";
import type { FormIdentityType } from "~/types/component";
import { db } from "../db";

export enum BOOK_RELATION {
  AUTHOR,
  CATEGORY,
  TAG,
  SERIES,
  VARIANT,
}

export type AddItem<T> = {
  formData: FormIdentityType;
  otherData?: T;
};

export async function getExistingIds({
  relation,
  transaction,
  bookId,
}: {
  relation: BOOK_RELATION;
  transaction: Prisma.TransactionClient;
  bookId: string;
}): Promise<string[]> {
  switch (relation) {
    case BOOK_RELATION.AUTHOR: {
      const authors = await transaction.bookAuthor.findMany({
        where: { bookId },
        select: { authorId: true },
      });
      return authors.map((a) => a.authorId);
    }

    case BOOK_RELATION.CATEGORY: {
      const categories = await transaction.bookCategory.findMany({
        where: { bookId },
        select: { categoryId: true },
      });
      return categories.map((cat) => cat.categoryId);
    }

    case BOOK_RELATION.TAG: {
      const tags = await transaction.bookTag.findMany({
        where: { bookId },
        select: { tagId: true },
      });
      return tags.map((t) => t.tagId);
    }

    case BOOK_RELATION.SERIES: {
      const series = await transaction.bookSeries.findMany({
        where: { bookId },
        select: { seriesId: true },
      });
      return series.map((s) => s.seriesId);
    }

    case BOOK_RELATION.VARIANT: {
      const variants = await transaction.bookVariant.findMany({
        where: { bookId },
        select: { id: true },
      });

      return variants.map((v) => v.id);
    }

    default:
      return [];
  }
}

export function getIdsToDelete({
  existingIds,
  incomingIds,
}: {
  existingIds: string[];
  incomingIds: string[];
}): string[] {
  return existingIds.filter((id) => !incomingIds.includes(id));
}

export async function deleteIds({
  relation,
  transaction,
  idsToDelete,
  bookId,
}: {
  relation: BOOK_RELATION;
  transaction: Prisma.TransactionClient;
  idsToDelete: string[];
  bookId: string;
}): Promise<void> {
  if (idsToDelete.length === 0) return;

  switch (relation) {
    case BOOK_RELATION.AUTHOR:
      await transaction.bookAuthor.deleteMany({
        where: {
          bookId,
          authorId: { in: idsToDelete },
        },
      });
      break;

    case BOOK_RELATION.CATEGORY:
      await transaction.bookCategory.deleteMany({
        where: { bookId, categoryId: { in: idsToDelete } },
      });
      break;

    case BOOK_RELATION.TAG:
      await transaction.bookTag.deleteMany({
        where: { bookId, tagId: { in: idsToDelete } },
      });
      break;

    case BOOK_RELATION.SERIES:
      await transaction.bookSeries.deleteMany({
        where: { bookId, seriesId: { in: idsToDelete } },
      });
      break;

    case BOOK_RELATION.VARIANT:
      await transaction.bookVariant.deleteMany({
        where: { id: { in: idsToDelete } },
      });
      break;

    default:
      console.warn(`deleteIds: Unknown book relation, skipping deletion`);
      return;
  }
}

export function getIdsToAdd(input: FormIdentityType[]): string[] {
  return input.filter((i) => i.mode === "create").map((i) => i.id);
}

export async function addIds<T = { order?: number }>({
  relation,
  transaction,
  bookId,
  addData,
  loggedUserId,
}: {
  relation: BOOK_RELATION;
  transaction: Prisma.TransactionClient;
  bookId: string;
  addData: Array<AddItem<T>>;
  loggedUserId: string;
  seriesOrder?: number;
}): Promise<void> {
  if (addData.length === 0) return;

  switch (relation) {
    case BOOK_RELATION.AUTHOR:
      await transaction.bookAuthor.createMany({
        data: addData.map((data) => ({
          bookId,
          authorId: data.formData.id,
          createdById: loggedUserId,
        })),
        skipDuplicates: true,
      });
      break;

    case BOOK_RELATION.CATEGORY:
      await transaction.bookCategory.createMany({
        data: addData.map((data) => ({
          bookId,
          categoryId: data.formData.id,
          createdById: loggedUserId,
        })),
        skipDuplicates: true,
      });
      break;

    case BOOK_RELATION.TAG:
      await transaction.bookTag.createMany({
        data: addData.map((data) => ({
          bookId,
          tagId: data.formData.id,
          createdById: loggedUserId,
        })),
        skipDuplicates: true,
      });
      break;

    case BOOK_RELATION.SERIES: {
      type SeriesData = { order: number };
      await transaction.bookSeries.createMany({
        data: (addData as AddItem<SeriesData>[]).map((data) => ({
          bookId,
          seriesId: data.formData.id,
          createdById: loggedUserId,
          seriesOrder: data.otherData?.order ?? 1,
        })),
        skipDuplicates: true,
      });
      break;
    }

    case BOOK_RELATION.VARIANT: {
      type VariantData = {
        format: BookFormat;
        description?: string | null;
        price: number;
        salePrice?: number | null;
        stock?: number | null;
      };

      const variantItems = addData as AddItem<VariantData>[];

      for (const data of variantItems) {
        const mode = data.formData.mode;

        if (mode === "create") {
          await transaction.bookVariant.create({
            data: {
              bookId,
              format: data.otherData?.format ?? "Paperback",
              title: data.formData.name,
              description: data.otherData?.description,
              price: data.otherData?.price ?? 0,
              salePrice: data.otherData?.salePrice,
              stock: data.otherData?.stock ?? 0,
            },
          });
        } else if (mode === "update") {
          // Assume variant ID comes from `data.formData.id`
          const variantId = data.formData.id;

          if (!variantId) throw new Error("Missing variant ID for update.");

          await transaction.bookVariant.update({
            where: { id: variantId },
            data: {
              format: data.otherData?.format ?? "Paperback",
              title: data.formData.name,
              description: data.otherData?.description,
              price: data.otherData?.price ?? 0,
              salePrice: data.otherData?.salePrice,
              stock: data.otherData?.stock ?? 0,
            },
          });
        }
      }

      break;
    }

    default:
      console.warn(`addIds: Unsupported relation`);
      break;
  }
}

export async function updateRelation<T = unknown>({
  relation,
  transaction,
  bookId,
  input,
  loggedUserId,
}: {
  relation: BOOK_RELATION;
  transaction: Prisma.TransactionClient;
  bookId: string;
  input: Array<AddItem<T>>;
  loggedUserId: string;
}): Promise<void> {
  const existingIds = await getExistingIds({
    relation,
    transaction,
    bookId,
  });

  const idsToDelete = getIdsToDelete({
    existingIds,
    incomingIds: input.map((i) => i.formData.id),
  });

  await deleteIds({
    relation,
    transaction,
    bookId,
    idsToDelete,
  });

  await addIds({
    relation,
    transaction,
    bookId,
    addData: input,
    loggedUserId,
  });
}

export async function getBookPreview({
  bookId,
  transaction,
}: {
  bookId: string;
  transaction: Prisma.TransactionClient;
}): Promise<BookPreviewType | null> {
  const book = await transaction.book.findUnique({
    where: { id: bookId },
    select: {
      id: true,
      title: true,
      description: true,
      slug: true,
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
      images: {
        select: {
          image: {
            select: {
              id: true,
              url: true,
            },
          },
        },
      },
    },
  });

  if (!book) return null;

  const { images, categories, authors, variants, ...others } = book;

  return {
    ...others,
    authors: authors.map((a) => a.author),
    categories: categories.map((c) => c.category),
    images: images.map((i) => i.image),
    variants: variants.map((v) => ({
      id: v.id,
      title: v.title,
      format: v.format,
      price: v.price.toNumber(),
      salePrice: v.salePrice?.toNumber() ?? null,
      stock: v.stock ?? null,
    })),
  } satisfies BookPreviewType;
}
