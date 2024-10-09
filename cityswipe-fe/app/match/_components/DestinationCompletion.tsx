"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
// To be implemented
// import { Button } from "@/components/ui";
// import { BgPattern } from "@/components/ui";

import { useSavedDestinationContext } from "../../../context/savedDestinationContext";
import { useDestinationSetContext } from "../../../context/destinationSetContext";
import { loadMoreCards } from "../_utils/loadCards";
import { checkSubscribed } from "../_utils/checkSubscribed";
import { useRouter } from "next/navigation";
import LoadingModal from "@/components/ui/loadingModal";

const DestinationCompletion = () => {
  const [destinationSet, setDestinationSet] = useDestinationSetContext();
  const { cards } = destinationSet;
  // const cardsAmount = games[game.id]?.cards.length;
  const cardsAmount = cards.length;
  const [destination, setDestination] = useSavedDestinationContext();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const memoizedStats = useRef({
    destination_count: structuredClone(destination.destinations.length),
    cardsAmount: structuredClone(cardsAmount),
  });

  const loadMore = async () => {
    setLoading(true)
    await checkSubscribed() ? loadMoreCards(destinationSet, setDestinationSet) : router.push("/pricing")
    setLoading(false)
  };

  return (
    <div
      className={`flex p-5 w-full min-h-screen h-full flex-col place-content-center justify-center text-gray-700`}
    >
      <LoadingModal show={loading} text="Scouring the globe for your destinations..."/>
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
        <button 
          onClick={() => router.push('/explore')} 
          className="mt-8 self-center py-2 px-4  bg-gradient-to-t from-cyan-500 to-green-400 text-white hover:opacity-90 font-bold rounded"
        >
          Chat with my matches!
        </button>
      </motion.div>
    </div>
  );
};

export default DestinationCompletion;
