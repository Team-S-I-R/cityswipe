import { generateDestinations } from "@/app/quiz/generateDestinations";
import { useDestinationSetContext } from "@/context/destinationSetContext";
import { DestinationSet } from "@/lib/destinationSet.type";
import getStripe from "@/utils/get-stripe";
import { Dispatch, SetStateAction, useCallback } from "react";
import Stripe from "stripe";

export const loadMoreCards = async (destinationSet:DestinationSet, setDestinationSet: Dispatch<SetStateAction<DestinationSet>>, stripe:Stripe) => {
  // you could make something like "if "active" then run the function". it needs to be "active" same casing ans all and it should work
  // NOTE: We could set this as a global variable to reduce how much we have to write to paywall stuff. Just let me know if this is far enough or if you need me to do more.
  // const subscriptionStatus = subscription?.status as string


   
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
 };