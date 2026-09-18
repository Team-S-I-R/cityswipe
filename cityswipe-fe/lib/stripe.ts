import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;
export const isStripeConfigured = Boolean(secretKey?.startsWith("sk_"));
export const isBillingConfigured = isStripeConfigured
  && Boolean(process.env.STRIPE_M_PLAN?.startsWith("price_"))
  && Boolean(process.env.STRIPE_Y_PLAN?.startsWith("price_"));

// Defer configuration errors until a payment operation is actually requested.
export const stripe = new Stripe(isStripeConfigured ? secretKey! : "sk_not_configured", {
  typescript: true,
});

export const appUrl = (process.env.APP_URL || process.env.PRODUCTION_URL || "http://localhost:3000").replace(/\/$/, "");

export async function getStripeSession({ priceId, domainUrl, customerId }: { priceId: string; domainUrl: string; customerId: string }) {
  if (!isBillingConfigured) throw new Error("Subscriptions are currently unavailable.");
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    billing_address_collection: "auto",
    line_items: [{ price: priceId, quantity: 1 }],
    payment_method_types: ["card"],
    customer_update: { address: "auto", name: "auto" },
    success_url: `${domainUrl}/results/success`,
    cancel_url: `${domainUrl}/results/cancelled`,
  });
  if (!session.url) throw new Error("Could not start checkout. Please try again.");
  return session.url;
}
