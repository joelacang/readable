import { adminProcedure, createTRPCRouter } from "../trpc";
import z from "zod";
import { DateRange, type KPIResults } from "~/types/component";
import { getDateRange } from "~/utils/get-values";
import { getSalesPerformanceGroupedBy } from "~/server/helpers/dashboard";

export const dashboardRouter = createTRPCRouter({
  getKPIs: adminProcedure
    .input(z.object({ range: z.nativeEnum(DateRange) }))
    .query(async ({ ctx, input }) => {
      const { start, end } = getDateRange({
        range: input.range,
        mode: "recent",
      });

      const dateFilter = start && end ? { gte: start, lt: end } : {};

      const sales = await ctx.db.orderItem.aggregate({
        where: {
          order: {
            status: { in: ["PAID", "IN_TRANSIT", "DELIVERED"] },
          },
          createdAt: dateFilter,
        },
        _sum: {
          subTotal: true,
          quantity: true,
        },
      });

      const orders = await ctx.db.order.count({
        where: {
          status: { in: ["PAID", "DELIVERED", "IN_TRANSIT"] },
          createdAt: dateFilter,
        },
      });

      const newCustomers = await ctx.db.user.count({
        where: {
          role: {
            in: ["USER"],
          },
          createdAt: dateFilter,
        },
      });

      const newReviews = await ctx.db.review.count({
        where: {
          status: { in: ["APPROVED", "PUBLISHED"] },
          createdAt: dateFilter,
        },
      });

      const returns = await ctx.db.order.count({
        where: {
          status: { in: ["REFUNDED", "CANCELED"] },
          createdAt: dateFilter,
        },
      });

      return {
        revenue: sales._sum.subTotal?.toNumber() ?? 0,
        booksSold: sales._sum.quantity ?? 0,
        orders,
        newCustomers,
        newReviews,
        returns,
      } satisfies KPIResults;
    }),

  getSalesPerformance: adminProcedure
    .input(
      z.object({ range: z.nativeEnum(DateRange), cursor: z.number().int() }),
    )
    .query(async ({ input }) => {
      return await getSalesPerformanceGroupedBy(input.range);
    }),
});
