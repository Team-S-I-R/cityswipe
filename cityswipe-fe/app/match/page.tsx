"use client";
import { motion, AnimatePresence, cubicBezier } from "framer-motion";
import { GameCompletion, GameCards } from "./_components";


import { savedDestination as initialDestination } from "./_components/savedDestination.api";
import { getInitialGame } from "./_components/games.api";
import { useGameContext } from "./_components/gameContext";
import { useEffect } from "react";
import { useSavedDestinationContext } from "./_components/savedDestinationContext";
import { Button } from "@/components/ui/button";
import Header from "../cs-componets/header";

const Match = () => {
  // "game" is the list of games 
  const [game, setGame] = useGameContext();
  const [_, setDestination] = useSavedDestinationContext();

  const initialGame = getInitialGame(0);

  useEffect(() => {
    setDestination(initialDestination);
    // setGame(game);
    // setGame({
    //     id: 1,
    //     cards: destination.reverse(),
    // });
  }, []);

  const isCardStockEmpty = game.cards.length === 0;
  const gameScreenVariants = {
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
      <main className="min-h-screen h-full mx-auto bg-gameSwipe-neutral">
        <AnimatePresence mode="wait">
          {!isCardStockEmpty ? (
            <motion.div
              // else (if the matching is not done) 
              key="gameScreen1"
              id="gameScreen"
              variants={gameScreenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <GameCards />
            </motion.div>
            /* if the matching is done! */
          ) : (
            <motion.div
              key="gameScreen2"
              id="gameCompletion"
              variants={gameScreenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <GameCompletion />
            </motion.div>
          )}
        </AnimatePresence>

      </main>


    </>
  )
}

export default Match;