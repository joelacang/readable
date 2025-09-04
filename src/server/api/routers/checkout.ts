import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { stripe } from "~/utils/stripe";
import { multiSessionClient } from "better-auth/client/plugins";

export const checkoutRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const cart = await ctx.db.cart.findUnique({
      where: { userId: ctx.session.user.id },
      select: {
        id: true,
        items: {
          select: {
            id: true,
            book: {
              select: {
                id: true,
                title: true,
                images: {
                  select: {
                    image: {
                      select: {
                        url: true,
                      },
                    },
                  },
                },
              },
            },
            variant: {
              select: {
                id: true,
                format: true,
                price: true,
                stock: true,
              },
            },
            quantity: true,
          },
        },
      },
    });

    if (!cart?.items.length)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Cart is empty.",
      });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        ...cart.items.map((item) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: `${item.book.title} - ${item.variant.format}`,
              images: item.book.images.map((i) => i.image.url),
              metadata: {
                cartItemId: item.id,
                bookId: item.book.id,
                variantId: item.variant.id,
                format: item.variant.format,
                type: "book",
              },
            },
            unit_amount: Number(
              (item.variant.price.toNumber() * 100).toFixed(0),
            ),
          },
          quantity: item.quantity,
        })),
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      metadata: {
        userId: ctx.session.user.id,
        name: ctx.session.user.name,
        email: ctx.session.user.email,
        cartId: cart.id,
      },
      shipping_address_collection: {
        allowed_countries: ["US", "PH", "CA", "GB"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1000,
              currency: "usd",
            },
            display_name: "Standard Shipping Option",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 5 },
              maximum: { unit: "business_day", value: 14 },
            },
          },
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
      customer_email: ctx.session.user.email,
    });

    return { url: session.url };
  }),
});
