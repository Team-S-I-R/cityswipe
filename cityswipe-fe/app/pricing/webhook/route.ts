import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { currentUserId } from "@/app/actions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Here is the issue. I have tried many ways to get the userId so I can update our db but I cant for some reason. 
// I dont know what to do to get that Id but if we can then this will work.
export async function POST(req: NextRequest) {

  const userId = await currentUserId()

  // i just need this to actually be the id instead of undefined
  console.log("User ID:", userId);

  const reqText = await req.text();
  return webhooksHandler(reqText, req, userId);
}

async function getCustomerEmail(customerId: string): Promise<string | null> {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    
    return (customer as Stripe.Customer).email;
  } catch (error) {
    console.error("Error fetching customer:", error);
    return null;
  }
}

async function getCustomerId(customerId: string): Promise<string | null> {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    console.log("Customer ID:", customer.id);
    return customer.id;
  } catch (error) {
    console.error("Error fetching customer:", error);
    return null;
  }
}

async function getSubscriptionId(customerId: string): Promise<string | null> {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    console.log("Customer:", customer);
    const subscription = await stripe.subscriptions.list({ customer: customerId });
    const subscriptionId = subscription.data[0]?.id;
    return subscriptionId ?? null;
  } catch (error) {
    console.error("Error fetching customer:", error);
    return null;
  }
}

async function handleSubscriptionEvent(
  event: Stripe.Event,
  type: "created" | "updated" | "deleted",
) {
  const subscription = event.data.object as Stripe.Subscription;
  const customerEmail = await getCustomerEmail(subscription.customer as string);
  const subscriptionId = await getSubscriptionId(subscription.customer as string);
  const customerId = await getCustomerId(subscription.customer as string);

  if (!customerEmail) {
    return NextResponse.json({
      status: 500,
      error: "Customer email could not be fetched",
    });
  }

  const subscriptionData: any = {
    subscription_id: subscription.id,
    stripe_user_id: subscription.customer,
    status: subscription.status,
    start_date: new Date(subscription.created * 1000).toISOString(),
    plan_id: subscription.items.data[0]?.price.id,
    user_id: subscription.metadata?.userId || "",
    email: customerEmail,
  };

  let data, error;

  if (type === "created") {
    if (!error) {
      await prisma?.subscription?.update({
        where: {
          stripeCustomerId: customerId as string,
        },
        data: {
          status: "created",
        },
      });
    }
  }
  if (type === "updated") {
    if (!error) {
      await prisma?.subscription?.update({
        where: {
          stripeCustomerId: customerId as string,
        },
        data: {
          status: "updated",
        },
      });
    }
  }
  if (type === "deleted") {
    if (!error) {
      await prisma?.subscription?.update({
        where: {
          stripeCustomerId: customerId as string,
        },
        data: {
          status: "cancelled",
        },
      });
    }
  }

  if (error) {
    console.error(`Error during subscription ${type}:`, error);
    return NextResponse.json({
      status: 500,
      error: `Error during subscription ${type}`,
    });
  }

  return NextResponse.json({
    status: 200,
    message: `Subscription ${type} success`,
    data,
  });
}

async function handleCheckoutSessionCompleted(
  event: Stripe.Event,
): Promise<NextResponse> {
  const session = event.data.object as Stripe.Checkout.Session;
  const metadata: any = session?.metadata;
  const subscription = event.data.object as Stripe.Subscription;
  const subscriptionId = await getSubscriptionId(subscription.customer as string);
  const customerId = await getCustomerId(subscription.customer as string);

  if (metadata?.subscription === "true") {
    const subscriptionId = session.subscription;
    try {
      await stripe.subscriptions.update(subscriptionId as string, { metadata });

      await prisma?.subscription?.update({
        where: {
          stripeCustomerId: customerId as string,
        },
        data: {
          stripeSubscriptionId: subscriptionId as string,
        },
      });

      return NextResponse.json({
        status: 200,
        message: "Subscription metadata updated successfully",
      });
    } catch (error) {
      console.error("Error updating subscription metadata:", error);
      return NextResponse.json({
        status: 500,
        error: "Error updating subscription metadata",
      });
    }
  }
  return NextResponse.json({
    status: 400,
    error: "No subscription metadata found",
  });
}

async function webhooksHandler(
  reqText: string,
  request: NextRequest,
  userId: any
): Promise<NextResponse> {

  const sig = request.headers.get("Stripe-Signature");
  console.log("userId: ", userId);


  try {
    const event = await stripe.webhooks.constructEventAsync(
      reqText,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case "customer.subscription.created":
        return handleSubscriptionEvent(event, "created");
      case "customer.subscription.updated":
        return handleSubscriptionEvent(event, "updated");
      case "customer.subscription.deleted":
        return handleSubscriptionEvent(event, "deleted");
      case "checkout.session.completed":
        return handleCheckoutSessionCompleted(event);
      default:
        return NextResponse.json({
          status: 400,
          error: "Unhandled event type",
        });
    }
  } catch (err) {
    console.error("Error constructing Stripe event:", err);
    return NextResponse.json({
      status: 500,
      error: "Webhook Error: Invalid Signature",
    });
  }
}