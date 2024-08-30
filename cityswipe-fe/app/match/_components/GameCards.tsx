/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { GameCard } from "./";
import { GameActionBtn } from "./";

// import { BgPattern } from "@/components/ui";
import { useDestinationSetContext } from "../../../context/destinationSetContext";
// import { useUserContext } from "@/store/userContext";
// import { themeColors } from "@/lib/theme";
// import handleScore from "../_utils/handleScore";

// import { GameActionBtn, GameCard } from "./";

import { CardSwipeDirection, IsDragOffBoundary } from "@/lib/destinationSet.type";
import { useSavedDestinationContext } from "../../../context/savedDestinationContext";
import handleResponse from "../_utils/handleResponse";
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
  const [destinationSet, setDestinationSet] = useDestinationSetContext();
  const [savedDestination, setSavedDestination] = useSavedDestinationContext();

  // const { score } = user;
  const { cards } = destinationSet;
  const { destinations } = savedDestination;

  const [direction, setDirection] = useState<CardSwipeDirection | "">("");
  const [isDragOffBoundary, setIsDragOffBoundary] =
    useState<IsDragOffBoundary>(null);
  const [cardDrivenProps, setCardDrivenProps] = useState(initialDrivenProps);
  const [isDragging, setIsDragging] = useState(false);

  const handleActionBtnOnClick = (btn: CardSwipeDirection) => {
    setDirection(btn);
  };

  // This controls the cards that people are swiping on. If left or right it removes that card from available cards left to swipe on in the first place
  useEffect(() => {
    if (["left", "right"].includes(direction)) {
      setDestinationSet({
        ...destinationSet,
        cards: destinationSet.cards.slice(0, -1), // Slice the cards array to remove the last element
      });
    }

    // This updates the destinations array with the new destinations after a right swipe
    direction === "right" &&
      setSavedDestination({
        destinations: handleResponse({ direction, cards, destinations }),
      });

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
      className={`flex p-5 min-h-screen h-full flex-col justify-center items-center overflow-hidden  ${
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
        className="flex flex-col gap-6 w-full items-center justify-center relative z-10"
      >
        <div
          id="cardsWrapper"
          className="w-full aspect-[100/150] max-w-xs mb-[5px] relative z-10"
        >
          <AnimatePresence>
            {cards.map((card, i) => {
              const isLast = i === cards.length - 1;
              const isUpcoming = i === cards.length - 2;
              return (
                <motion.div
                  key={`card-${i}`}
                  id={`card-${card.id}`}
                  className={`relative `}
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
          className="flex items-center justify-center w-full gap-4 relative z-10"
        >
          <GameActionBtn
            direction="left"
            ariaLabel="swipe left"
            scale={cardDrivenProps.buttonScaleBadAnswer}
            isDragOffBoundary={isDragOffBoundary}
            onClick={() => handleActionBtnOnClick("left")}
          />
          <GameActionBtn
            direction="right"
            ariaLabel="swipe right"
            scale={cardDrivenProps.buttonScaleGoodAnswer}
            isDragOffBoundary={isDragOffBoundary}
            onClick={() => handleActionBtnOnClick("right")}
          />
        </div>

        <Link
          id="destinations_button"
          className="flex items-center justify-center w-full gap-4 relative z-10 pt-10"
          href="/explore"
        >
          <Button className="bg-gradient-to-t from-cyan-500 to-green-400 select-none w-max">
            See Save Destinations
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default GameCards;
