"use server"

import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import Stripe from "stripe";

export const checkSubscribed = async () => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })
  const clerkuser = await currentUser();

  // get the current user from supabase:
  const user = await prisma.user.findUnique({
    where: {
      id: clerkuser?.id
    }
  })

  // get the current user from supabase:
  const subscription1 =await prisma?.subscription?.findUnique({
    where: {
      stripeSubscriptionId: user?.stripeCustomerId as string
    }
  })
  const customer = await stripe.customers.retrieve(user?.stripeCustomerId as string)
  console.log(customer)
  console.log(subscription1)
  const subscription = await stripe.subscriptions.retrieve("sub_1Q6EgsBQfbTtpxdVZ9ol0ere");
  //  console.log(session)
   console.log("sub:",subscription)
   
   // Check if user is subscribed
   // const session = await stripe.checkout.sessions.retrieve(destinationSet.sessionId);
   // const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
   
   if (!subscription || subscription.status !== 'active') {
     return false;
   }

  return true

}