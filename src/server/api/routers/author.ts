import { createAuthorSchema } from "~/zod-schemas/author";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { generateSlug } from "~/utils/get-values";
import { TRPCError } from "@trpc/server";
import z from "zod";
import type { UserPreviewType } from "~/types/users";
import type { AuthorDetailType } from "~/types/author";

export const authorRouter = createTRPCRouter({
  create: adminProcedure
    .input(createAuthorSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await ctx.db.$transaction(async (transaction) => {
          const slug = generateSlug(input.name);

          const author = await transaction.author.create({
            data: {
              name: input.name,
              slug,
              biography: input.biography,
              website: input.website,
              facebook: input.facebook,
              instagram: input.instagram,
              xTwitter: input.xTwitter,
              tiktok: input.tiktok,
              wattpad: input.wattpad,
              birthDate: input.birthDate,
              nationality: input.nationality,
            },
          });

          return author;
        });

        return result;
      } catch (error) {
        console.error("Error creating author: ", error);
        throw new TRPCError({
          code: "UNPROCESSABLE_CONTENT",
          message: "Error occurred while creating author.",
          cause: error,
        });
      }
    }),

  searchAuthor: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      const authorsMatched = await ctx.db.author.findMany({
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

      const authors: UserPreviewType[] = authorsMatched.map((author) => ({
        id: author.id,
        name: author.name,
        image: null,
      }));

      return authors;
    }),

  getAuthorDetailsById: publicProcedure
    .input(z.object({ authorId: z.string() }))
    .query(async ({ ctx, input }) => {
      const author = await ctx.db.author.findUnique({
        where: { id: input.authorId },
        select: {
          id: true,
          name: true,
          biography: true,
          website: true,
          nationality: true,
          facebook: true,
          instagram: true,
          xTwitter: true,
          tiktok: true,
          wattpad: true,
          birthDate: true,
          profileImageUrl: true,
        },
      });

      if (!author) return null;

      return {
        ...author,
        imageUrl: author.profileImageUrl,
      } as AuthorDetailType;
    }),
});
