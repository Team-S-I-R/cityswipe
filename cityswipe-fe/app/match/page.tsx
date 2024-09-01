"use client";
import { motion, AnimatePresence, cubicBezier } from "framer-motion";
import { DestinationCompletion, DestinationCards } from "./_components";


import { savedDestination as initialDestination } from "../../api/savedDestination.api";
import { getInitialSet } from "../../api/destinationSets.api";
import { useDestinationSetContext } from "../../context/destinationSetContext";
import { useEffect } from "react";
import { useSavedDestinationContext } from "../../context/savedDestinationContext";
import { Button } from "@/components/ui/button";
import Header from "../cs-componets/header";

const Match = () => {
  // "destination" is the list of destinations 
  const [destinationSet, setDestinationSet] = useDestinationSetContext();
  const [_, setDestination] = useSavedDestinationContext();

  const initialDestinationSet = getInitialSet(0);

  useEffect(() => {
    setDestination(initialDestination);
    // setDestination(destination);
    // setDestination({
    //     id: 1,
    //     cards: destination.reverse(),
    // });
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




  return (
    <>
    <Header />
      <main className="min-h-screen h-full mx-auto bg-destinationSwipe-neutral">
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
            /* if the matching is done! */
          ) : (
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
  )
}

export default Match;