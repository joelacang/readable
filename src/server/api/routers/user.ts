import type { UserType } from "~/types/users";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getLoggedUser: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user) return null;

    const loggedUser = ctx.session.user;

    const roleData = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: { role: true },
    });

    if (!roleData) return null;

    return {
      id: loggedUser.id,
      name: loggedUser.name,
      username: loggedUser.username ?? null,
      image: loggedUser.image ?? null,
      role: roleData?.role,
    } satisfies UserType;
  }),

  isAdmin: protectedProcedure.query(async ({ ctx }) => {
    return ctx.session.user.role === "ADMIN";
  }),
});
