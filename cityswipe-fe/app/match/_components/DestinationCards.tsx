/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { DestinationCard } from ".";
import { DestinationActionBtn } from ".";
import { useDestinationSetContext } from "../../../context/destinationSetContext";
import {
  CardSwipeDirection,
  IsDragOffBoundary,
} from "@/lib/destinationSet.type";
import { useSavedDestinationContext } from "../../../context/savedDestinationContext";
import handleResponse from "../_utils/handleResponse";
import { Button } from "@/components/ui/button";
import { useCitySwipe } from "@/app/citySwipeContext";
import { addMatch } from "@/app/actions";
import { generateDestinations } from "@/app/quiz/generateDestinations";

export const easeInExpo = [0.7, 0, 0.84, 0];
export const easeOutExpo = [0.16, 1, 0.3, 1];
export const easeInOutExpo = [0.87, 0, 0.13, 1];

const initialDrivenProps = {
  cardWrapperX: 0,
  buttonScaleBadAnswer: 1,
  buttonScaleGoodAnswer: 1,
  mainBgColor: "#fafafa",
};

const DestinationCards = () => {
  const { userdata, setUserData } = useCitySwipe();
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

  const loadMore = useCallback(async () => {
    // get responses from saved
    let responses = [
      "not available",
      "yes. ",
      "not available",
      "any climate",
      "any landscape/scenery",
      "none in particular",
      "none in particular",
      "none",
    ]
    // need to store original locations 
    // pass those into generate destinations and 
    // tell the function not to include those places
    const newDestinations = await generateDestinations(responses, destinationSet.allCards.map(card => card.city))
    // fix ordering
    const destinations = destinationSet.cards.concat(newDestinations.reverse())
    await setDestinationSet({
      id: 1,
      cards: destinations,
      allCards: destinationSet.allCards.concat(destinations.reverse()),
    })
    // console.log(destinationSet.allCards.map(card => card.city))

    // add it as auto request when paid account
  }, []);

  // This controls the cards that people are swiping on. If left or right it removes that card from available cards left to swipe on in the first place
  useEffect(() => {
    if (["left", "right"].includes(direction)) {
      setDestinationSet({
        ...destinationSet,
        cards: destinationSet.cards.slice(0, -1), // Slice the cards array to remove the last element
      });
    }

    if (direction === "right") {
      // This updates the destinations array with the new destinations after a right swipe
      const updatedDestinations = handleResponse({
        direction,
        cards,
        destinations,
      });
      setSavedDestination({
        destinations: updatedDestinations,
      });

      // server action that adds a match to the database
      addMatch({ destinations: updatedDestinations });
    }

    // add paywall

    // load more matches automatically ##BUG: fix screen reload animation
    // if (destinationSet.cards.length == 5) {
    //   loadMore()
    // }

    setDirection("");
  }, [direction, loadMore]);

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
        className="flex flex-col place-content-center place-items-center gap-3 w-full h-full relative z-10"
      >
        <div
          id="cardsWrapper"
          className="w-full relative overflow-hidden place-content-center place-items-center h-full sm:min-h-[600px] flex flex-col"
        >
          <AnimatePresence>
            {cards.map((card, i) => {
              const isLast = i === cards.length - 1;
              const isUpcoming = i === cards.length - 2;
              return (
                <motion.div
                  key={`card-${i}`}
                  id={`card-${card.id}`}
                  className={`w-full absolute top-[5%] h-[calc(100%-15%)] md:min-h-[500px] flex place-content-center place-items-center z-10`}
                  variants={cardVariants}
                  initial="remainings"
                  animate={
                    isLast ? "current" : isUpcoming ? "upcoming" : "remainings"
                  }
                  exit="exit"
                >
                  <DestinationCard
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

        <div className="w-full flex flex-col h-max gap-4 place-items-center">
          <div
            id="actions"
            className="flex items-center justify-center w-max h-max gap-4 relative z-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 1000 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2 }}
            >
              <DestinationActionBtn
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
              <DestinationActionBtn
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
            <Link
              id="destinations_button"
              className="flex items-center justify-center w-max gap-4 relative z-10 h-max"
              href="/explore"
            >
              <Button className="text-[12px] bg-gradient-to-t from-cyan-500 to-green-400 select-none w-max">
                See Save Destinations
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default DestinationCards;
