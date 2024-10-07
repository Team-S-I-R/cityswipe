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

async function fetchData(clerkuser: any) {

    console.log("clerkuser: ", clerkuser?.id);
    
    try {

      const user = await prisma.user.findUnique({
        where: {
          id: clerkuser?.id,
        },
        select: {
          id: true,
          stripeCustomerId: true,
        },
      });

      console.log("user: ", user);

      // create user in database
      if (user === null) {
        await prisma.user.create({
          data: {
            id: clerkuser?.id,
            email: clerkuser?.emailAddresses[0].emailAddress as string,
            username: clerkuser?.username as string,
            name: clerkuser?.fullName as string,
            profileImg: clerkuser?.imageUrl as string,
            stripeCustomerId: "",
          },
        });

        console.log("user creation: ", user);

      }
    
      // create stripe customer in database
      if (!user?.stripeCustomerId) {
        
        const data = await stripe?.customers?.create({
          email: clerkuser?.emailAddresses[0].emailAddress as string,
        });

        console.log("data: ", clerkuser?.id)
    
        await prisma.user.update({
          where: {
            id: clerkuser?.id,
          },
          data: {
            stripeCustomerId: data.id,
          },
        });
      }
    } catch (error) {
      console.error("Error in fetchData:", error);
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


// Subscribe

//  Cancel?

// active month ends

async function getSubscriptionStatus() {

  const subscriptionId = await getSubId();
  const clerkuser = await currentUser();

  if (!subscriptionId) {
    console.error("No subscription ID found.");
    return null;
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    await prisma?.subscription.update({
      where: {
        stripeSubscriptionId: subscriptionId,
        userId: clerkuser?.id,
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

  if (user) {
    await fetchData(user);
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
