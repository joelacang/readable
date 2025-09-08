import { createContactSchema, type ContactType } from "~/zod-schemas/contact";
import { adminProcedure, createTRPCRouter } from "../trpc";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const contactRouter = createTRPCRouter({
  create: adminProcedure
    .input(createContactSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await ctx.db.$transaction(async (tx) => {
          const data = await tx.contact.create({
            data: {
              name: input.name,
              email: input.email,
              phone: input.phone,
              position: input.position,
              role: input.role,
              description: input.description,
              address: input.address
                ? {
                    create: {
                      line1: input.address.line1,
                      line2: input.address.line2,
                      city: input.address.city,
                      state: input.address.state,
                      postal_code: input.address.postalCode,
                      country: input.address.country,
                    },
                  }
                : undefined,
            },
            include: {
              address: true,
            },
          });

          const contact: ContactType = {
            id: data.id,
            name: data.name,
            description: data.description,
            phone: data.phone,
            position: data.position,
            role: data.role,
            email: data.email,
            address: data.address
              ? {
                  ...data.address,
                  postalCode: data.address.postal_code,
                }
              : null,
          };

          return contact;
        });

        return result;
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
      const data = await ctx.db.contact.findMany({
        where: { name: { contains: input.searchValue, mode: "insensitive" } },
        include: {
          address: true,
        },
      });

      const contacts: ContactType[] = data.map((c) => {
        const { address } = c;

        return {
          ...c,
          address: address
            ? {
                ...address,
                postalCode: address.postal_code,
              }
            : null,
        } satisfies ContactType;
      });

      return contacts;
    }),
});
