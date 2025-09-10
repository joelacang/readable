import { bookSeriesSchema } from "~/zod-schemas/book";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { generateSlug } from "~/utils/get-values";
import { TRPCError } from "@trpc/server";
import z from "zod";
import type { FormIdentityType } from "~/types/component";

export const seriesRouter = createTRPCRouter({
  create: adminProcedure
    .input(bookSeriesSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const results = await ctx.db.$transaction(async (transaction) => {
          const slug = generateSlug(input.title);

          const series = await transaction.series.create({
            data: {
              title: input.title,
              description: input.description,
              slug,
              createdById: ctx.session.user.id,
            },
          });

          if (input.authors && input.authors.length > 0) {
            await transaction.authorSeries.createMany({
              data: input.authors.map((author) => ({
                seriesId: series.id,
                authorId: author.id,
                createdById: ctx.session.user.id,
              })),
            });
          }

          return series;
        });

        return results;
      } catch (error) {
        console.error("Error creating series", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error creating series",
          cause: error,
        });
      }
    }),

  searchSeries: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      const seriesMatched = await ctx.db.series.findMany({
        where: {
          title: {
            contains: input.name,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          title: true,
        },
      });

      const results: FormIdentityType[] = seriesMatched.map((series) => ({
        id: series.id,
        name: series.title,
        mode: "update",
      }));

      return results;
    }),
});
