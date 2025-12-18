import { stripe } from "~/utils/stripe";
import { db } from "../db";
import { clearCart } from "./cart";
import { createOrder, type ExtendedStripeSession } from "./order";
import type { PaymentDetailsType } from "~/types/order";

export async function handleCheckoutComplete(
  session: ExtendedStripeSession,
): Promise<string> {
  try {
    const userId = session.metadata?.userId;
    const cartId = session.metadata?.cartId;

    // Stripe Session Data
    console.log("Checkout session completed", session);

    if (!userId || !cartId) {
      console.error("❌ Missing metadata:", { userId, cartId });
      throw new Error("Missing required metadata.");
    }

    const paymentIntent = session.payment_intent
      ? await stripe.paymentIntents.retrieve(session.payment_intent as string)
      : null;

    const paymentMethod = paymentIntent?.payment_method
      ? await stripe.paymentMethods.retrieve(
          paymentIntent.payment_method as string,
        )
      : null;

    const card = paymentMethod?.type === "card" ? paymentMethod.card : null;
    let paymentDetails: PaymentDetailsType | null = null;

    if (card) {
      paymentDetails = {
        brand: card.brand,
        last4: card.last4,
        exp_month: card.exp_month,
        exp_year: card.exp_year,
      };
    }

    const result = await db.$transaction(async (tx) => {
      // Create the order
      const orderResult = await createOrder({
        session,
        transaction: tx,
        paymentDetails,
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
      return orderId;
    });

    return result;
  } catch (error) {
    console.error("Failed checkout process: ", error);
    throw new Error("Checkout processing failed.");
  }
}
