import { generateDestinations } from "@/app/quiz/generateDestinations";
import { DestinationSet } from "@/lib/destinationSet.type";
import { Dispatch, SetStateAction } from "react";

export async function loadMoreCards(destinationSet: DestinationSet, setDestinationSet: Dispatch<SetStateAction<DestinationSet>>) {
  const newCards = await generateDestinations(destinationSet.responses, destinationSet.allCards.map(card => card.city));
  setDestinationSet(previous => ({
    ...previous,
    id: 1,
    cards: [...[...newCards].reverse(), ...previous.cards],
    allCards: previous.allCards.concat(newCards),
  }));
}
