import z from "zod";
import { adminProcedure, createTRPCRouter } from "../trpc";
import { TRPCError } from "@trpc/server";
import { utapi } from "~/server/uploadthing";
import type { LinkDetailType } from "~/types/component";

export const imageRouter = createTRPCRouter({
  createBookImages: adminProcedure
    .input(
      z.object({
        bookId: z.string(),
        images: z.array(
          z.object({
            name: z.string().optional(),
            url: z.string(),
            size: z.number().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (input.images.length > 0) {
          const results = await Promise.allSettled(
            input.images.map(async (image) => {
              return ctx.db.$transaction(async (t) => {
                const createdImage = await t.image.create({
                  data: {
                    name: image.name,
                    url: image.url,
                    uploadedById: ctx.session.user.id,
                    size: image.size,
                  },
                  select: { id: true, name: true, url: true },
                });

                await t.bookImages.create({
                  data: {
                    bookId: input.bookId,
                    imageId: createdImage.id,
                  },
                });

                return {
                  id: createdImage.id,
                  name: createdImage.name ?? `Image ${createdImage.id}`,
                  slug: createdImage.url,
                } satisfies LinkDetailType;
              });
            }),
          );

          const successful = results
            .filter((result) => result.status === "fulfilled")
            .map((result) => result.value);

          return successful;
        }
      } catch (error) {
        console.error("Can't add images", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Can't add images.",
        });
      }
    }),

  deleteImage: adminProcedure
    .input(z.object({ imgId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const results = await ctx.db.$transaction(async (t) => {
          const imageData = await t.image.findUnique({
            where: { id: input.imgId },
          });

          if (!imageData) return null;

          if (imageData.name) {
            await utapi.deleteFiles(imageData.name);
          }

          const deletedImage = await t.image.delete({
            where: { id: imageData.id },
          });

          return deletedImage.id;
        });
      } catch (error) {
        console.error("Can't delete images", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Can't delete images.",
        });
      }
    }),
});
