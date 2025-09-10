import { createContactSchema, type ContactType } from "~/zod-schemas/contact";
import { adminProcedure, createTRPCRouter } from "../trpc";
import { TRPCError } from "@trpc/server";
import z from "zod";
import type { Prisma } from "@prisma/client";

export const contactRouter = createTRPCRouter({
  create: adminProcedure
    .input(createContactSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const results = await ctx.db.$transaction(async (tx) => {
          const { address, ...otherInputs } = input;

          const contactData: Prisma.ContactCreateInput = {
            ...otherInputs,
            createdBy: {
              connect: {
                id: ctx.session.user.id,
              },
            },
          };

          if (address) {
            contactData.address = {
              create: address,
            };
          }

          const contact = await tx.contact.create({
            data: contactData,
            include: {
              address: true,
            },
          });

          return contact as ContactType;
        });

        return results;
      } catch (error) {
        console.error(`Error creating contact: `, error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unknown error occurred",
          cause: error,
        });
      }
    }),

  search: adminProcedure
    .input(z.object({ searchValue: z.string() }))
    .query(async ({ ctx, input }) => {
      const contacts = await ctx.db.contact.findMany({
        where: { name: { contains: input.searchValue, mode: "insensitive" } },
        include: {
          address: true,
        },
      });

      return contacts as ContactType[];
    }),
});
