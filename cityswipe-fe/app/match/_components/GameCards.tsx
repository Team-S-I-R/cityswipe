/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {GameCard} from "./";
import {GameActionBtn} from "./";

// import { BgPattern } from "@/components/ui";
import { useGameContext } from "./gameContext";
// import { useUserContext } from "@/store/userContext";
// import { themeColors } from "@/lib/theme";
// import handleScore from "../_utils/handleScore";

// import { GameActionBtn, GameCard } from "./";

import { CardSwipeDirection, IsDragOffBoundary } from "@/lib/games.type";
import { useDestinationContext } from "./destinationContext";
import handleResponse from "./handleResponse";
import { Button } from "@/components/ui/button";

export const easeInExpo = [0.7, 0, 0.84, 0];
export const easeOutExpo = [0.16, 1, 0.3, 1];
export const easeInOutExpo = [0.87, 0, 0.13, 1];

const initialDrivenProps = {
  cardWrapperX: 0,
  buttonScaleBadAnswer: 1,
  buttonScaleGoodAnswer: 1,
  mainBgColor: "#fafafa",
};

const GameCards = () => {
  // const [user, setUser] = useUserContext();
  const [game, setGame] = useGameContext();
  const [destination, setDestination] = useDestinationContext();

  // const { score } = user;
  const { cards } = game;
  const { destinations } = destination;

  const [direction, setDirection] = useState<CardSwipeDirection | "">("");
  const [isDragOffBoundary, setIsDragOffBoundary] =
    useState<IsDragOffBoundary>(null);
  const [cardDrivenProps, setCardDrivenProps] = useState(initialDrivenProps);
  const [isDragging, setIsDragging] = useState(false);

  const handleActionBtnOnClick = (btn: CardSwipeDirection) => {
    setDirection(btn);
  };

  // This controlls the cards that people are swiping on. If left or right it removes that card from available cards left to swipe on in the first place
  useEffect(() => {
    if (["left", "right"].includes(direction)) {
      
      setGame({
        ...game,
        cards: game.cards.slice(0, -1), // Slice the cards array to remove the last element
      });

      
      }
    
    direction === "right" && setDestination({
      destinations: handleResponse({direction, cards, destinations}),
    })
      
    setDirection("");
  }, [direction]);

  const cardVariants = {
    current: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: easeOutExpo },
    },
    upcoming: {
      opacity: 0.5,
      y: 67,
      scale: 0.9,
      transition: { duration: 0.3, ease: easeOutExpo, delay: 0 },
    },
    remainings: {
      opacity: 0,
      y: 20,
      scale: 0.9,
    },
    exit: {
      opacity: 0,
      x: direction === "left" ? -300 : 300,
      y: 40,
      rotate: direction === "left" ? -20 : 20,
      transition: { duration: 0.3, ease: easeOutExpo },
    },
  };

  return (
    <motion.div
      className={`flex p-5 w-screen h-screen flex-col justify-center items-center overflow-hidden  ${
        isDragging ? "cursor-grabbing" : ""
      }`}
      style={{ backgroundColor: cardDrivenProps.mainBgColor }}
    >
      {/* <BgPattern /> */}
      {/* <Link
        href="/"
        id="close"
        className="absolute top-[20px] right-[20px] w-[30px] h-auto"
      >
        <X className="text-gray-500 w-full h-full" />
      </Link> */}

      <div
        id="gameUIWrapper"
        className="flex flex-col place-content-center place-items-center gap-6 w-full h-full relative z-10"
      >
        <div
          id="cardsWrapper"
          className="w-full relative overflow-hidden place-content-center place-items-center h-[600px] flex flex-col relative z-10"
        >
          <AnimatePresence>
            {cards.map((card, i) => {
              const isLast = i === cards.length - 1;
              const isUpcoming = i === cards.length - 2;
              return (
                <motion.div
                  key={`card-${i}`}
                  id={`card-${card.id}`}
                  className={`w-full h-full flex place-content-center place-items-center z-10`}
                  variants={cardVariants}
                  initial="remainings"
                  animate={
                    isLast ? "current" : isUpcoming ? "upcoming" : "remainings"
                  }
                  exit="exit"
                >
                  <GameCard
                    data={card}
                    id={card.id}
                    setCardDrivenProps={setCardDrivenProps}
                    setIsDragging={setIsDragging}
                    isDragging={isDragging}
                    isLast={isLast}
                    setIsDragOffBoundary={setIsDragOffBoundary}
                    setDirection={setDirection}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div
          id="actions"
          className="flex items-center justify-center w-max h-max gap-4 relative z-10"
        >
          <motion.div
          initial={{ opacity: 0, y: 1000 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2 }}
          >

            <GameActionBtn
              direction="left"
              ariaLabel="swipe left"
              scale={cardDrivenProps.buttonScaleBadAnswer}
              isDragOffBoundary={isDragOffBoundary}
              onClick={() => handleActionBtnOnClick("left")}
            />

          </motion.div>

            <motion.div
            initial={{ opacity: 0, y: 1000 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2 }}            
            >

              <GameActionBtn
                direction="right"
                ariaLabel="swipe right"
                scale={cardDrivenProps.buttonScaleGoodAnswer}
                isDragOffBoundary={isDragOffBoundary}
                onClick={() => handleActionBtnOnClick("right")}
              />

            </motion.div>

        </div>

        <motion.div
        initial={{ opacity: 0, y: 1000 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 4 }}
        >

          <Link id="destinations_button" className="flex items-center justify-center w-max gap-4 relative z-10 h-max"  href="/explore">
            <Button className="text-[12px] bg-gradient-to-t from-cyan-500 to-green-400 select-none w-max">See Save Destinations</Button>
          </Link>

        </motion.div>

      </div>
    </motion.div>
  );
};

export default GameCards;
