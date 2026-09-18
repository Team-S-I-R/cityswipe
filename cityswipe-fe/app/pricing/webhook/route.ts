import { stripe, isStripeConfigured } from "@/lib/stripe";
import Stripe from "stripe";
import prisma from "@/lib/db";

async function syncSubscription(subscription: Stripe.Subscription) {
  const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
  const user = await prisma.user.findUnique({ where: { stripeCustomerId: customerId } });
  if (!user) throw new Error("Subscription customer not found");
  const price = subscription.items.data[0]?.price;
  if (!price) throw new Error("Subscription price not found");
  const data = {
    stripeSubscriptionId: subscription.id,
    userId: user.id,
    username: user.username,
    stripeCustomerId: customerId,
    currentPeriodStart: subscription.current_period_start,
    currentPeriodEnd: subscription.current_period_end,
    status: subscription.status,
    planId: price.id,
    interval: price.recurring?.interval || "month",
  };
  await prisma.subscription.upsert({ where: { userId: user.id }, create: data, update: data });
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!isStripeConfigured || !secret?.startsWith("whsec_")) {
    return new Response("Billing is unavailable", { status: 503 });
  }
  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });
  let event: Stripe.Event;
  try { event = stripe.webhooks.constructEvent(await request.text(), signature, secret); }
  catch { return new Response("Invalid signature", { status: 400 }); }

  try {
    if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      await syncSubscription(event.data.object);
    } else if (event.type === "checkout.session.completed" || event.type === "invoice.payment_succeeded" || event.type === "invoice.payment_failed") {
      const subscription = event.data.object.subscription;
      if (subscription) {
        await syncSubscription(await stripe.subscriptions.retrieve(typeof subscription === "string" ? subscription : subscription.id));
      }
    }
  } catch {
    // A non-success response lets Stripe retry delivery after temporary database failures.
    return new Response("Unable to update subscription", { status: 500 });
  }
  return new Response(null, { status: 200 });
}
