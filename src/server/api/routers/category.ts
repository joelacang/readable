import {
  createCategorySchema,
  updateCategorySchema,
} from "~/zod-schemas/category";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { generateSlug } from "~/utils/get-values";
import type { CategoryDetailType } from "~/types/categories";
import z from "zod";

export const categoryRouter = createTRPCRouter({
  create: adminProcedure
    .input(createCategorySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const response = await ctx.db.$transaction(async (transaction) => {
          const slug = generateSlug(input.name);

          const namesTaken = await transaction.category.findFirst({
            where: {
              OR: [{ code: input.code }, { name: input.name }, { slug: slug }],
            },
            select: { id: true },
          });

          if (namesTaken) {
            throw new TRPCError({
              code: "UNPROCESSABLE_CONTENT",
              message: "Category code, name, or slug is already taken.",
            });
          }

          const category = await transaction.category.create({
            data: {
              name: input.name,
              slug,
              code: input.code,
              parentId: input.parentId,
              description: input.description,
              metaTitle: input.metaTitle,
              metaDescription: input.metaDescription,
              imageUrl: input.imageUrl,
            },
          });

          return category;
        });

        return response;
      } catch (error) {
        console.error(error); // Don't swallow the error
        throw error instanceof TRPCError
          ? error
          : new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Something went wrong.",
            });
      }
    }),

  getCategories: publicProcedure.query(async ({ ctx }) => {
    const categoriesData = await ctx.db.category.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
        color: true,
        slug: true,
        code: true,
        parentId: true,
        metaTitle: true,
        metaDescription: true,
        imageUrl: true,
        sortOrder: true,
      },
    });

    // Step 1: Map all categories into an object for quick lookup
    const categoryMap = new Map<string, CategoryDetailType>();

    for (const cat of categoriesData) {
      const { ...base } = cat;

      categoryMap.set(cat.id, {
        ...base,
        subCategories: [],
      });
    }

    // Step 2: Build the hierarchy
    const rootCategories: CategoryDetailType[] = [];

    for (const category of categoryMap.values()) {
      if (category.parentId) {
        const parent = categoryMap.get(category.parentId);
        if (parent) {
          parent.subCategories.push(category);
        }
      } else {
        rootCategories.push(category);
      }
    }

    return rootCategories;
  }),

  update: adminProcedure
    .input(updateCategorySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const results = ctx.db.$transaction(async (t) => {
          const updatedCategory = t.category.update({
            where: { id: input.categoryId },
            data: {
              name: input.name,
              code: input.code,
              description: input.description,
              parentId: input.parentId,
              metaTitle: input.metaTitle,
              metaDescription: input.metaDescription,
              imageUrl: input.imageUrl,
            },
          });

          return updatedCategory;
        });

        return results;
      } catch (error) {
        console.error(`Can't update category`, error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
          cause: error,
        });
      }
    }),

  delete: adminProcedure
    .input(z.object({ categoryId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const results = await ctx.db.$transaction(async (t) => {
          const deletedCategory = await t.category.delete({
            where: { id: input.categoryId },
          });

          return deletedCategory;
        });

        return results;
      } catch (error) {
        console.error(`Error deleting category `, error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error deleting category.",
          cause: error,
        });
      }
    }),
  searchCategory: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      const categoriesMatched = await ctx.db.category.findMany({
        where: {
          name: {
            contains: input.name,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          name: true,
        },
      });

      return categoriesMatched;
    }),

  getCategoryBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const category = await ctx.db.category.findUnique({
        where: { slug: input.slug },
        select: {
          id: true,
          name: true,
          description: true,
          icon: true,
          color: true,
          slug: true,
          code: true,
        },
      });

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No category found with slug '${input.slug}'`,
        });
      }

      return category;
    }),
});
