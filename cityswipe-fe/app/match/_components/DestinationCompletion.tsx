"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
// To be implemented
// import { Button } from "@/components/ui";
// import { BgPattern } from "@/components/ui";

import { useSavedDestinationContext } from "../../../context/savedDestinationContext";
import { useDestinationSetContext } from "../../../context/destinationSetContext";
import { getInitialSet } from "@/api/destinationSets.api";
import Link from "next/link";
import { generateDestinations } from "@/app/quiz/generateDestinations";

const DestinationCompletion = () => {
  const [destinationSet, setDestinationSet] = useDestinationSetContext();
  const { cards } = destinationSet;

  // const cardsAmount = games[game.id]?.cards.length;
  const cardsAmount = cards.length;
  const initialDestinationSet = getInitialSet(0);
  const [destination, setDestination] = useSavedDestinationContext();
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState<string[]>([
    "not available",
    "yes. ",
    "not available",
    "any climate",
    "any landscape/scenery",
    "none in particular",
    "none in particular",
    "none",
  ]);

  const memoizedStats = useRef({
    destination_count: structuredClone(destination.destinations.length),
    cardsAmount: structuredClone(cardsAmount),
  });

  useEffect(() => {
    // get questions responses db
    // setResponses([
    //   "not available",
    //   "yes. ",
    //   "not available",
    //   "any climate",
    //   "any landscape/scenery",
    //   "none in particular",
    //   "none in particular",
    //   "none",
    // ]);
  });

  // const handleReplay = () => {
  //   setUser(initialUser);
  //   setGame(initialGame);
  // };
  // console.log(destination.destinations[0].toString());

  const loadMore = async () => {
    // need to store original locations 
    // pass those into generate destinations and 
    // tell the function not to include those places
    const destinations = await generateDestinations(responses)
    await setDestinationSet({
      id: 1,
      cards: destinations.reverse(),
    })
    console.log(destinationSet)

    // add it as auto request when paid account
  }

  return (
    <div
      className={`flex p-5 min-h-screen h-full flex-col items-center justify-center  bg-gameSwipe.neutral text-gray-700`}
    >
      {/* <BgPattern /> */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: { ease: "backOut", duration: 0.2, delay: 0.15 },
        }}
        className="flex flex-col items-center justify-center text-center relative z-10"
      >
        <h1 className="text-5xl md:text-[60px] leading-tight font-acuminMedium">
          Complete!
        </h1>
        <p className="text-2xl font-acuminMedium  text-gray-800/70 z-10">
          You have added {memoizedStats.current.destination_count} destinations
          to you saved locations.
        </p>

        <button onClick={loadMore} className="bg-gradient-to-t from-cyan-500 to-green-400 text-white hover:opacity-90 font-bold py-2 px-4 rounded mt-8">
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
