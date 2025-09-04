import { BookFormat, OrderStatus } from "@prisma/client";
import z from "zod";

export const orderItemSchema = z.object({
  orderId: z.string().cuid(),
  bookId: z.string().cuid(),
  variantId: z.string().cuid(),
  product_name: z.string(),
  product_price: z.number().positive(),
  imageUrls: z.array(z.string().url()).min(1),
  format: z.nativeEnum(BookFormat),
  quantity: z.number().int().positive(),
  subTotal: z.number(),
});

export const orderSchema = z.object({
  userId: z.string().cuid(),
  stripeSessionId: z.string(),
  stripePaymentIntentId: z.string().nullable().optional(),
  totalAmount: z.number().positive(),
  subTotal: z.number().positive(),
  shippingFee: z.number().min(0).default(0),
  taxAmount: z.number().min(0).default(0),
  discount: z.number().min(0).default(0),
  currency: z.string().length(3).default("usd"),
  status: z.nativeEnum(OrderStatus),

  // Payment Details - Many should be optional
  paymentMethodType: z.string().optional(),
  paymentLast4: z.string().length(4).optional(),
  paymentBrand: z.string().optional(),
  receiptUrl: z.string().url().optional(),

  // Customer Info
  customerId: z.string().cuid().optional(),
  stripeCustomerId: z.string().optional(),
  customerName: z.string().min(1),
  customerEmail: z.string().email(),

  // Shipping Info - Should be optional (digital products might not need shipping)
  shippingName: z.string().optional(),
  shippingPhone: z.string().optional(),
  shippingEmail: z.string().email().optional(),
  shippingAddressLine1: z.string().optional(),
  shippingAddressLine2: z.string().optional(),
  shippingAddressCity: z.string().optional(),
  shippingAddressState: z.string().optional(),
  shippingAddressPostalCode: z.string().optional(),
  shippingAddressCountry: z.string().length(2).optional(),

  note: z.string().optional(),
  trackingNumber: z.string().optional(),
  shippedAt: z.date().optional(),
  deliveredAt: z.date().optional(),
});

export type CreateOrderType = z.infer<typeof orderSchema>;

// Helper schema for creating orders (more restrictive)
export const createOrderSchema = orderSchema
  .pick({
    userId: true,
    stripeSessionId: true,
    totalAmount: true,
    subTotal: true,
    shippingFee: true,
    taxAmount: true,
    currency: true,
    status: true,
    customerName: true,
    customerEmail: true,
  })
  .extend({
    // Required for creation
    shippingAddressLine1: z.string().min(1),
    shippingAddressCity: z.string().min(1),
    shippingAddressState: z.string().min(1),
    shippingAddressPostalCode: z.string().min(1),
    shippingAddressCountry: z.string().length(2),
  });
