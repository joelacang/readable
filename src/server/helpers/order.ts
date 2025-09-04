import { Prisma, type BookFormat } from "@prisma/client";
import type Stripe from "stripe";
import { stripe } from "~/utils/stripe";
import { TRPCError } from "@trpc/server";
import { generateId } from "~/utils/get-values";
import type { OrderPreviewType } from "~/types/order";

export interface ExtendedStripeSession extends Stripe.Checkout.Session {
  shipping_details?: {
    name?: string | null;
    address?: {
      line1?: string | null;
      line2?: string | null;
      city?: string | null;
      state?: string | null;
      postal_code?: string | null;
      country?: string | null;
    } | null;
    carrier?: string | null;
    phone?: string | null;
  } | null;
}

export async function createOrder({
  session,
  transaction,
}: {
  session: ExtendedStripeSession;
  transaction: Prisma.TransactionClient;
}): Promise<{ orderId: string }> {
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    expand: [`data.price.product`],
  });

  const totalAmount = session.amount_total! / 100;
  const subTotal = session.amount_subtotal! / 100;

  const customerDetails = session.customer_details;
  const shippingDetails = session.shipping_details;
  const shippingFee = session.shipping_cost?.amount_total
    ? session.shipping_cost.amount_total / 100
    : 0;

  if (!session.metadata?.userId)
    throw new TRPCError({
      code: "UNPROCESSABLE_CONTENT",
      message: "Can't create order. No userId found.",
    });

  const order = await transaction.order.create({
    data: {
      refCode: generateId(10).toUpperCase(),
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent as string,
      totalAmount,
      subTotal,
      shippingFee,
      currency: session.currency ?? "usd",
      status: session.payment_status === "paid" ? "PAID" : "PENDING",

      paymentMethodType: session.payment_method_types?.[0],
      paymentStatus: session.payment_status,

      userId: session.metadata.userId,
      customerName: session.metadata.name ?? customerDetails?.name ?? "",
      customerEmail: session.metadata.email ?? customerDetails?.email,

      shippingName: shippingDetails?.name ?? customerDetails?.name,
      shippingPhone: shippingDetails?.phone ?? customerDetails?.phone,
      shippingLine1: shippingDetails?.address?.line1,
      shippingLine2: shippingDetails?.address?.line2,
      shippingCity: shippingDetails?.address?.city,
      shippingState: shippingDetails?.address?.state,
      shippingPostal: shippingDetails?.address?.postal_code,
      shippingCountry: shippingDetails?.address?.country,
    },
  });

  if (!order)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Unable to create order.",
    });

  const productLineItems = lineItems.data.filter((item) => {
    const product = item.price?.product as Stripe.Product;
    return product && product.metadata.type === "book";
  });

  const orderItemsData = productLineItems.map((item) => {
    const product = item.price?.product as Stripe.Product;

    return {
      orderId: order.id,
      bookId: product.metadata.bookId!,
      variantId: product.metadata.variantId!,
      name: product.name,
      price: item.amount_total / item.quantity! / 100,
      imageUrls: product.images,
      format: product.metadata.format! as BookFormat,
      quantity: item.quantity ?? 1,
      subTotal: item.amount_subtotal / 100,
    };
  });

  await transaction.orderItem.createMany({
    data: orderItemsData,
  });

  return { orderId: order.id };
}

export const OrderPreviewSelection = {
  id: true,
  refCode: true,
  stripeSessionId: true,
  stripePaymentIntentId: true,
  totalAmount: true,
  subTotal: true,
  shippingFee: true,
  taxAmount: true,
  discount: true,
  status: true,
  paymentStatus: true,
  createdAt: true,
  shippingName: true,
  shippingPhone: true,
  shippingEmail: true,
  shippingLine1: true,
  shippingLine2: true,
  shippingCity: true,
  shippingState: true,
  shippingPostal: true,
  shippingCountry: true,
  customer: {
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      image: true,
    },
  },
} as const;

const orderPreviewSelect = Prisma.validator()(OrderPreviewSelection);

export type OrderPreviewSelected = Prisma.OrderGetPayload<{
  select: typeof orderPreviewSelect;
}>;

export function getOrderPreviews(
  data: OrderPreviewSelected[],
): OrderPreviewType[] {
  const orders: OrderPreviewType[] = data.map((order) => {
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
    };
  });

  return orders;
}
