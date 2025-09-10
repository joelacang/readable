import { createOrgSchema } from "~/zod-schemas/organization";
import { adminProcedure, createTRPCRouter } from "../trpc";
import { TRPCError } from "@trpc/server";
import type { Prisma } from "@prisma/client";
import type { OrganizationDetailType } from "~/types/organization";

export const orgRouter = createTRPCRouter({
  create: adminProcedure
    .input(createOrgSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const results = await ctx.db.$transaction(async (tx) => {
          const { address, contactIds, ...otherInputs } = input;

          const orgData: Prisma.OrganizationCreateInput = {
            ...otherInputs,
            createdBy: {
              connect: {
                id: ctx.session.user.id,
              },
            },
          };

          if (address) {
            orgData.address = {
              create: address,
            };
          }

          const response = await tx.organization.create({
            data: {
              ...orgData,
              organizationContacts: {
                createMany: {
                  data: contactIds.map((id) => ({
                    contactId: id,
                    createdById: ctx.session.user.id,
                  })),
                },
              },
            },
            include: {
              address: true,
              organizationContacts: {
                select: {
                  contact: {
                    include: {
                      address: true,
                    },
                  },
                },
              },
            },
          });

          const { organizationContacts, ...otherFields } = response;

          const organization: OrganizationDetailType = {
            ...otherFields,
            contactPersons: organizationContacts.map(
              (orgContact) => orgContact.contact,
            ),
          };

          return organization;
        });

        return results;
      } catch (error) {
        console.error(`Error creating organization`, error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unknown error occurred.",
          cause: error,
        });
      }
    }),
});
