"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
// To be implemented
// import { Button } from "@/components/ui";
// import { BgPattern } from "@/components/ui";

import { useSavedDestinationContext } from "../../../context/savedDestinationContext";
import { useDestinationSetContext } from "../../../context/destinationSetContext";
import Link from "next/link";
import { generateDestinations } from "@/app/quiz/generateDestinations";
import Stripe from "stripe";

const DestinationCompletion = () => {
  const [destinationSet, setDestinationSet] = useDestinationSetContext();
  const { cards } = destinationSet;
  // const cardsAmount = games[game.id]?.cards.length;
  const cardsAmount = cards.length;
  const [destination, setDestination] = useSavedDestinationContext();
  const [loading, setLoading] = useState(false);
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

  const memoizedStats = useRef({
    destination_count: structuredClone(destination.destinations.length),
    cardsAmount: structuredClone(cardsAmount),
  });

  const loadMore = useCallback(async () => {
    setLoading(true)
    // const subscription = await stripe.subscriptions.retrieve("sub_1Q5X16BQfbTtpxdVPrd6hnXn");
    // console.log(session)
    // console.log(subscription)

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

    // add it as auto request when paid account
    setLoading(false)
  }, []);

  return (
    <div
      className={`flex p-5 w-full min-h-screen h-full flex-col place-content-center justify-center text-gray-700`}
    >
      {/* <BgPattern /> */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: { ease: "backOut", duration: 0.2, delay: 0.15 },
        }}
        className="flex flex-col w-full place-content-center justify-center text-center relative z-10"
      >
        <h1 className="text-5xl md:text-[60px] leading-tight font-acuminMedium">
          Complete!
        </h1>
        <p className="text-2xl font-acuminMedium  text-gray-800/70 z-10">
          You have added {memoizedStats.current.destination_count} destinations
          to you saved locations.
        </p>

        <button onClick={loadMore} className="self-center bg-gradient-to-t from-cyan-500 to-green-400 text-white hover:opacity-90 font-bold py-2 px-4 rounded mt-8">
          load more
        </button>

        <Link href="/explore">
          <button className="bg-gradient-to-t from-cyan-500 to-green-400 text-white hover:opacity-90 font-bold py-2 px-4 rounded mt-8">
            Chat with my matches!
          </button>
        </Link>

        {/* <motion.div className="mt-8" whileTap={{ scale: 0.9 }}>
          <Button
            onClick={() => handleReplay()}
            className="bg-blue-500 text-[20px] uppercase px-8 pt-6 pb-5 text-white"
          >
            Replay
          </Button>
        </motion.div> */}
      </motion.div>
    </div>
  );
};

export default DestinationCompletion;
