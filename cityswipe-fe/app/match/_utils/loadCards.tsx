import { generateDestinations } from "@/app/quiz/generateDestinations";
import { useDestinationSetContext } from "@/context/destinationSetContext";
import { DestinationSet } from "@/lib/destinationSet.type";
import { Dispatch, SetStateAction, useCallback } from "react";

export const loadMoreCards = async (destinationSet:DestinationSet, setDestinationSet: Dispatch<SetStateAction<DestinationSet>>) => {
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
 };