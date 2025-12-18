import z from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { sanitizeInput } from "~/utils/get-values";

export const tagRouter = createTRPCRouter({
  create: adminProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const sanitizedName = sanitizeInput(input.name);
      const existingTag = await ctx.db.tag.findFirst({
        where: { name: sanitizedName },
        select: {
          id: true,
          name: true,
        },
      });

      if (existingTag) return existingTag;

      const tag = await ctx.db.tag.create({
        data: {
          name: sanitizedName,
          createdById: ctx.session.user.id,
        },
      });

      return tag;
    }),
  searchTags: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      const tagsMatched = await ctx.db.tag.findMany({
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

      return tagsMatched ?? [];
    }),
});
