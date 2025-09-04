import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { db } from "~/server/db";
import { clearCart } from "~/server/helpers/cart";
import {
  createOrder,
  type ExtendedStripeSession,
} from "~/server/helpers/order";
import { stripe } from "~/utils/stripe";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session: ExtendedStripeSession = event.data.object;
    const userId = session.metadata?.userId;
    const cartId = session.metadata?.cartId;

    // Stripe Session Data
    console.log("Checkout session completed", session);

    if (!userId || !cartId) {
      console.error("❌ Missing metadata:", { userId, cartId });
      return NextResponse.json(
        { error: "Missing required metadata" },
        { status: 400 },
      );
    }

    try {
      const transactionResult = await db.$transaction(async (tx) => {
        // Create the order
        const orderResult = await createOrder({
          session,
          transaction: tx,
        });

        const orderId = orderResult.orderId;
        console.log(`Order with orderId: ${orderId} successfully created.`);

        // Clear the cart
        await clearCart({
          userId,
          transaction: tx,
          cartId,
          requireOwnership: false,
        });

        console.log(`Cart: ${cartId} cleared successfully`);
        return { orderId };
      });

      return NextResponse.json({
        received: true,
        orderId: transactionResult.orderId,
      });
    } catch (error) {
      console.error("Webhook processing failed:", error);
      return NextResponse.json({ error: "Processing failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
