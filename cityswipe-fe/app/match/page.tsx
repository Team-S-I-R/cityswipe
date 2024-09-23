"use client";

import { motion, AnimatePresence, cubicBezier } from "framer-motion";
import { DestinationCompletion, DestinationCards } from "./_components";
import { savedDestination as initialDestination } from "../../api/savedDestination.api";
import { getInitialSet } from "../../api/destinationSets.api";
import { useDestinationSetContext } from "../../context/destinationSetContext";
import { useEffect, useState } from "react";
import { useSavedDestinationContext } from "../../context/savedDestinationContext";
import Header from "../cs-componets/header";

const Match = () => {
  // "destination" is the list of destinations
  const [destinationSet, setDestinationSet] = useDestinationSetContext();
  const [_, setDestination] = useSavedDestinationContext();
  const [loading, setLoading] = useState(true);

  const initialDestinationSet = getInitialSet(0);

  useEffect(() => {
    setLoading(true);
    setDestination(initialDestination);
    // setDestination(destination);
    // setDestination({
    //     id: 1,
    //     cards: destination.reverse(),
    // });
    setLoading(false);
  }, []);

  const isCardStockEmpty = destinationSet.cards.length === 0;
  const destinationScreenVariants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: { duration: 2, ease: cubicBezier(0.16, 1, 0.3, 1) },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2, ease: cubicBezier(0.7, 0, 0.84, 0) },
    },
  };

  // const testPexelsAPI = async () => {
  //   const client = createClient('8U6Se7vVT3H9tx1KPZAQTkDUSW0IKi3ldgBTVyh3W9NFF7roIpZxktzY');
  //   const searchQuery = 'Tokyo, Japan landscape';
  //   try {
  //     const response = await client.photos.search({ query: `${searchQuery}`, per_page: 1 });
  //     console.log("pexels query", searchQuery);
  //     if ('photos' in response && response.photos.length > 0) {
  //       const illustration = response.photos[0].src.landscape;
  //       console.log(searchQuery, "illustration URL:", illustration);
  //     } else {
  //       console.log("No photos found for the query.");
  //     }
  //   } catch (error) {
  //     console.error(`Error in fetching photo for ${searchQuery}:`, error);
  //   }
  // };

  return (
    <>
      <Header />
      <main className="min-h-screen h-full mx-auto bg-gameSwipe-neutral">
        {/* img debug
        <button className="absolute top-[50%] left-10 bg-red-500 text-white px-4 rounded-md z-[100]" onClick={testPexelsAPI}>
          test
        </button> */}

        <AnimatePresence mode="wait">
          {!isCardStockEmpty ? (
            <motion.div
              // else (if the matching is not done)
              key="destinationScreen1"
              id="destinationScreen"
              variants={destinationScreenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <DestinationCards />
            </motion.div>
          ) : (
            /* if the matching is done! */
            <motion.div
              key="destinationScreen2"
              id="destinationCompletion"
              variants={destinationScreenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <DestinationCompletion />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
};

export default Match;
