"use client";
import { useRef } from "react";
import { motion } from "framer-motion";

// To be implemented
// import { Button } from "@/components/ui";

// import { BgPattern } from "@/components/ui";

import { savedDestination as initialDestination } from "../../../api/savedDestination.api";

import { useSavedDestinationContext } from "../../../context/savedDestinationContext";
import { useDestinationSetContext } from "../../../context/destinationSetContext";
import { getInitialSet } from "@/api/destinationSets.api";

const GameCompletion = () => {
  const [destinationSet, setDestinationSet] = useDestinationSetContext();

  // const cardsAmount = games[game.id]?.cards.length;
  const cardsAmount = 50;

  const initialDestinationSet = getInitialSet(0);

  const [destination, setDestination] = useSavedDestinationContext();

  const memoizedStats = useRef({
    destination_count: structuredClone(destination.destinations.length),
    cardsAmount: structuredClone(cardsAmount),
  });

  // const handleReplay = () => {
  //   setUser(initialUser);
  //   setGame(initialGame);
  // };
  // console.log(destination.destinations[0].toString());

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
          You have added {memoizedStats.current.destination_count} destinations to you saved locations.
        </p>
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

export default GameCompletion;
