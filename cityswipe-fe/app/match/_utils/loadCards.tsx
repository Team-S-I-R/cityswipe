import { generateDestinations } from "@/app/quiz/generateDestinations";
import { useDestinationSetContext } from "@/context/destinationSetContext";
import { DestinationSet } from "@/lib/destinationSet.type";
import getStripe from "@/utils/get-stripe";
import { Dispatch, SetStateAction, useCallback } from "react";
import Stripe from "stripe";
import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export const loadMoreCards = useCallback(async (destinationSet:DestinationSet, setDestinationSet: Dispatch<SetStateAction<DestinationSet>>, stripe:Stripe) => {
  
  const clerkuser = await currentUser();

  // get the current user from supabase:
  const user = await prisma.user.findUnique({
    where: {
      id: clerkuser?.id
    }
  })

  // get the current user from supabase:
  const subscription =await prisma?.subscription?.findUnique({
    where: {
      stripeSubscriptionId: user?.stripeCustomerId as string
    }
  })

  // you could make something like "if "active" then run the function". it needs to be "active" same casing ans all and it should work
  // NOTE: We could set this as a global variable to reduce how much we have to write to paywall stuff. Just let me know if this is far enough or if you need me to do more.
  const subscriptionStatus = subscription?.status as string

  // const subscription = await stripe.subscriptions.retrieve("sub_1Q5X16BQfbTtpxdVPrd6hnXn");
   // console.log(session)
   // console.log(subscription)
   // if (subscription.status !== 'active') {
   //   throw new Error('User is not subscribed');
   // }
   // Check if user is subscribed
   // const session = await stripe.checkout.sessions.retrieve(destinationSet.sessionId);
   // const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
   
   // if (subscription.status !== 'active') {
   //   throw new Error('User is not subscribed');
   // }
   
   // get responses from saved
   let responses = destinationSet.responses
   // store original locations 
   // pass those into generate destinations => cities and 
   // tell the function not to include those places
   const newDestinations = await generateDestinations(responses, destinationSet.allCards.map(card => card.city))
   // fix ordering
   const destinations = destinationSet.cards.concat(newDestinations.reverse())
   await setDestinationSet({
     id: 1,
     cards: destinations,
     allCards: destinationSet.allCards.concat(destinations.reverse()),
     responses: responses
   })
   // console.log(destinationSet.allCards.map(card => card.city))
 }, []);