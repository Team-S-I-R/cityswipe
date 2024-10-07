"use server"

import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import Stripe from "stripe";

export const checkSubscribed = async () => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })
    const clerkuser = await currentUser();

    // get the current user from supabase:
    const user = await prisma.user.findUnique({
      where: {
        id: clerkuser?.id
      }
    })

    if (!user) {
      throw new Error("User not found from clerk");
    }

    // get the current user subscription data from supabase:
    const data = await prisma?.subscription?.findUnique({
      where: {
        stripeCustomerId: user.stripeCustomerId as string,
        userId: user.id as string
      }
    })

    if (!data || !data.stripeSubscriptionId) {
      throw new Error("Subscription data not found from database");
    }
   
    // Check if the user is not subscribed
    if (data.status !== 'active') {
      return false;
    }
  } catch (error) {
    console.error("Error checking subscription status:", error);
    return false;
  }
  return true;
}

export const getSubscription = async () => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })
    const clerkuser = await currentUser();

    // get the current user from supabase:
    const user = await prisma.user.findUnique({
      where: {
        id: clerkuser?.id
      }
    })

    if (!user) {
      throw new Error("User not found from clerk");
    }

    // get the current user subscription data from supabase:
    const data = await prisma?.subscription?.findUnique({
      where: {
        stripeCustomerId: user.stripeCustomerId as string,
        userId: user.id as string
      }
    })

    if (!data || !data.stripeSubscriptionId) {
      throw new Error("Subscription data not found from database");
    }

    // get subscription data from stripe of corresponding user subscription
    const subscription = await stripe.subscriptions.retrieve(data.stripeSubscriptionId);
   
    // Check if the user is not subscribed
    if (!subscription) {
      return null;
    }
    
    const product = await stripe.products.retrieve((subscription as any).plan.product as string);

    return {status: subscription.status, current_period_end:subscription.current_period_end, plan:product.name}
  } catch (error) {
    console.error("Error checking subscription status:", error);
    return null;
  }
}