import { generateDestinations } from "@/app/quiz/generateDestinations";
import { useDestinationSetContext } from "@/context/destinationSetContext";
import getStripe from "@/utils/get-stripe";
import { useCallback } from "react";
import Stripe from "stripe";


const [destinationSet, setDestinationSet] = useDestinationSetContext();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })



export const loadMoreCards = useCallback(async () => {
   const subscription = await stripe.subscriptions.retrieve("sub_1Q5X16BQfbTtpxdVPrd6hnXn");
   // console.log(session)
   console.log(subscription)
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

 export default loadMoreCards;