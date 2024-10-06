import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.text();

  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: unknown) {
    console.error("Error constructing Stripe event:", error);
    return new Response("webhook error", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    try {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
      const customerId = String(session.customer);

      const user = await prisma.user.findUnique({
        where: {
          stripeCustomerId: customerId,
        },
      });

      const isSubscribtionInSupabase = await prisma.subscription.findUnique({
        where: {
          stripeSubscriptionId: subscription.id,
          userId: user?.id,
        },
      })

      if (!user) throw new Error("User not found...");

      // if the user has subscribed to us before
      if (isSubscribtionInSupabase) {

        await prisma.subscription.update({
          where: {
            stripeSubscriptionId: subscription.id,
            userId: user.id,
          },
          data: {
            stripeSubscriptionId: subscription.id,
            userId: user.id,
            username: user.username,
            currentPeriodStart: subscription.current_period_start,
            currentPeriodEnd: subscription.current_period_end,
            status: subscription.status,
            planId: subscription.items.data[0].plan.id,
            interval: String(subscription.items.data[0].plan.interval),
            stripeCustomerId: user.stripeCustomerId,
          },
        });

      }

      if (!isSubscribtionInSupabase){

        await prisma.subscription.create({
          data: {
            stripeSubscriptionId: subscription.id,
            userId: user.id,
            username: user.username,
            currentPeriodStart: subscription.current_period_start,
            currentPeriodEnd: subscription.current_period_end,
            status: subscription.status,
            planId: subscription.items.data[0].plan.id,
            interval: String(subscription.items.data[0].plan.interval),
            stripeCustomerId: user.stripeCustomerId,
          },
        });

      }


    } catch (error: unknown) {
      console.error("Error handling checkout.session.completed:", error);
    }
  }

  if (event.type === "invoice.payment_succeeded") {
    try {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
      const customerId = String(session.customer);

      const user = await prisma.user.findUnique({
        where: {
          stripeCustomerId: customerId,
        },
      });

      if (!user) throw new Error("User not found...");

      await prisma.subscription.update({
        where: {
          stripeSubscriptionId: subscription.id,
          userId: user.id,
        },
        data: {
          planId: subscription.items.data[0].price.id,
          currentPeriodStart: subscription.current_period_start,
          currentPeriodEnd: subscription.current_period_end,
          status: subscription.status,
        },
      });
    } catch (error: unknown) {
      console.error("Error handling invoice.payment_succeeded:", error);
    }
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    console.log("subscription: ", subscription)
    const customerId = String(session.customer);

    const user = await prisma.user.findUnique({
      where: {
        stripeCustomerId: customerId,
      },
    });

    if (!user) throw new Error("User not found...");

    await prisma.subscription.update({
      where: {
        stripeSubscriptionId: subscription.id,
        userId: user.id,
      },
      data: {
        planId: subscription.items.data[0].price.id,
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
        status: subscription.status,
        stripeSubscriptionId: subscription.id,
        interval: String(subscription.items.data[0].plan.interval),
      },
    });
  }

  return new Response(null, { status: 200 });
}
