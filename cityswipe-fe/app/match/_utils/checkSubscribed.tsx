"use server";

import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { stripe, isStripeConfigured } from "@/lib/stripe";

export async function checkSubscribed() {
  if (!isStripeConfigured) return false;
  const user = await currentUser();
  if (!user) return false;
  const subscription = await prisma.subscription.findUnique({ where: { userId: user.id } });
  return Boolean(subscription && ["active", "trialing"].includes(subscription.status)
    && subscription.currentPeriodEnd > Date.now() / 1000);
}

export async function getSubscription() {
  if (!isStripeConfigured) return null;
  const user = await currentUser();
  if (!user) return null;
  const data = await prisma.subscription.findUnique({ where: { userId: user.id } });
  if (!data) return null;
  const subscription = await stripe.subscriptions.retrieve(data.stripeSubscriptionId);
  const productId = subscription.items.data[0]?.price.product;
  const product = typeof productId === "string" ? await stripe.products.retrieve(productId) : productId;
  return {
    status: subscription.status,
    current_period_end: subscription.current_period_end,
    plan: product && !product.deleted ? product.name : "Pro",
  };
}
