import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CitySwipeProvider } from './citySwipeContext';
import "./globals.css";
import DestinationSetProvider from "../context/destinationSetContext";
import { getDestinationSet } from "../api/destinationSets.api";
import SavedDestinationProvider from "../context/savedDestinationContext";
import { getDestination } from "../api/savedDestination.api";
import { Analytics } from '@vercel/analytics/react';
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster"
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { stripe }  from "../lib/stripe"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CitySwipe",
  description: "Allowing you to find your perfect holiday destination match!",
};

async function fetchData() {

  const clerkuser = await currentUser();

  // select the id and the stripecus id from the user
  const user = await prisma.user.findUnique({
    where: {
      id: clerkuser?.id,
    },
    select: {
      id: true,
      stripeCustomerId: true,
    },
  });

  // create user in database
  if (!user) {
    console.log("No account.")
  }

  // crete stip customer in database
  if (!user?.stripeCustomerId) {
    const data = await stripe?.customers?.create({
      email: clerkuser?.emailAddresses[0].emailAddress as string,
    });

    await prisma.user.update({
      where: {
        id: clerkuser?.id,
      },
      data: {
        stripeCustomerId: data.id,
      },
    });
  }


}

async function getSubId() {
  const user = await currentUser();

  const subscription = await prisma?.subscription?.findUnique({
    where: {
      userId: user?.id,
    },
    select: {
      stripeSubscriptionId: true,
    },
  });

  return subscription?.stripeSubscriptionId;
}

async function getSubscriptionStatus() {

  const subscriptionId = await getSubId();

  if (!subscriptionId) {
    console.error("No subscription ID found.");
    return null;
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    await prisma?.subscription.update({
      where: {
        stripeSubscriptionId: subscriptionId,
      },
      data: {
        status: subscription.status,
      },
    })
    
    return subscription.status;

  } catch (error) {
    console.error("Error retrieving subscription status:", error);
    return null;
  }
}


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const destinationSet = await getDestinationSet(0);
  const savedDestination = await getDestination();
  const user = await currentUser();
  const subscriptionStatus = await getSubscriptionStatus();

  if (user) {
    await fetchData();
  }

  return (
    <ClerkProvider
    signInFallbackRedirectUrl={"/quiz"}
    signUpFallbackRedirectUrl={"/quiz"}
    >
      <html lang="en" className="overflow-hidden">
        <body className={`${inter.className}`}>
          <Toaster  />
        <Analytics />
          <CitySwipeProvider>
            <SavedDestinationProvider savedDestination={savedDestination}>
              <DestinationSetProvider destinationSet={destinationSet}>{children}</DestinationSetProvider>
            </SavedDestinationProvider>
          </CitySwipeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
