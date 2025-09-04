import z from "zod";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../trpc";
import type { OrderDetailType, OrderPreviewType } from "~/types/order";
import { TRPCError } from "@trpc/server";
import {
  getOrderPreviews,
  OrderPreviewSelection,
} from "~/server/helpers/order";

export const orderRouter = createTRPCRouter({
  getOrderBySessionId: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const order = await ctx.db.order.findUnique({
        where: {
          stripeSessionId: input.sessionId,
        },
        select: OrderPreviewSelection,
      });

      if (!order) return null;

      return {
        ...order,
        totalAmount: order.totalAmount.toNumber(),
        subTotal: order.subTotal.toNumber(),
        shippingFee: order.shippingFee?.toNumber(),
        taxAmount: order.taxAmount?.toNumber(),
        discount: order.discount?.toNumber(),
        userInfo: order.customer,
        shippingInfo: {
          name: order.shippingName ?? "",
          phone: order.shippingPhone,
          email: order.shippingEmail,
          address: {
            line1: order.shippingLine1 ?? "",
            line2: order.shippingLine2,
            city: order.shippingCity,
            state: order.shippingState,
            postalCode: order.shippingPostal ?? "",
            country: order.shippingCountry ?? "",
          },
        },
        dateCreated: order.createdAt,
      } satisfies OrderPreviewType;
    }),

  getOrderByRef: publicProcedure
    .input(z.object({ ref: z.string().nullable() }))
    .query(async ({ ctx, input }) => {
      if (!input.ref) return null;

      const data = await ctx.db.order.findUnique({
        where: { refCode: input.ref },
        include: {
          items: true,
          customer: true,
        },
      });

      if (!data) return null;

      const order: OrderDetailType = {
        id: data.id,
        refCode: data.refCode,
        stripeSessionId: data.stripeSessionId,
        stripePaymentIntentId: data.stripePaymentIntentId,
        totalAmount: data.totalAmount.toNumber(),
        subTotal: data.subTotal.toNumber(),
        shippingFee: data.shippingFee?.toNumber(),
        taxAmount: data.taxAmount?.toNumber(),
        discount: data.discount?.toNumber(),
        status: data.status,
        paymentStatus: data.paymentStatus,
        dateCreated: data.createdAt,
        userInfo: data.customer
          ? {
              id: data.customer.id,
              name: data.customer.name,
              username: data.customer.username,
              image: data.customer.image,
            }
          : null,
        shippingInfo: {
          name: data.shippingName ?? data.customerName,
          email: data.shippingEmail ?? data.customerEmail,
          phone: data.shippingPhone,
          address: {
            line1: data.shippingLine1 ?? "",
            line2: data.shippingLine2,
            city: data.shippingCity,
            state: data.shippingState,
            postalCode: data.shippingPostal ?? "",
            country: data.shippingCountry ?? "",
          },
        },
        items: data.items.map((item) => ({
          id: item.id,
          product: {
            id: item.bookId,
            name: item.name,
            format: item.format,
            price: item.price.toNumber(),
            imageUrl: item.imageUrls[0],
          },
          quantity: item.quantity,
          subTotal: item.subTotal.toNumber(),
        })),
        paymentInfo: {
          intentId: data.stripePaymentIntentId,
          method: data.paymentMethodType,
          last4cc: data.paymentLast4,
          receiptUrl: data.receiptUrl,
          status: data.paymentStatus,
        },
      };

      return order;
    }),

  getUserOrders: protectedProcedure
    .input(
      z.object({
        userId: z.string().cuid().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const isAdmin = ctx.session.user.role === "ADMIN";

      if (!isAdmin && input.userId)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not allowed to perform this admin action.",
        });

      const userIdToSearch =
        isAdmin && input.userId ? input.userId : ctx.session.user.id;

      const ordersData = await ctx.db.order.findMany({
        where: {
          userId: userIdToSearch,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: OrderPreviewSelection,
      });

      if (!ordersData) return [];

      const orders: OrderPreviewType[] = getOrderPreviews(ordersData);

      return orders;
    }),

  getOrdersByBookId: adminProcedure
    .input(z.object({ bookId: z.string() }))
    .query(async ({ ctx, input }) => {
      const ordersData = await ctx.db.order.findMany({
        where: {
          items: {
            some: {
              bookId: input.bookId,
            },
          },
        },
        select: OrderPreviewSelection,
      });

      const orders = getOrderPreviews(ordersData);

      return orders;
    }),
});
