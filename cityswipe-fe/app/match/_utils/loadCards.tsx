import { generateDestinations } from "@/app/quiz/generateDestinations";
import { DestinationSet } from "@/lib/destinationSet.type";
import { Dispatch, SetStateAction } from "react";

/** A failure whose message is safe to show to the traveler. */
export class DestinationLoadError extends Error {}

export async function loadMoreCards(destinationSet: DestinationSet, setDestinationSet: Dispatch<SetStateAction<DestinationSet>>) {
  const result = await generateDestinations(destinationSet.responses, destinationSet.allCards.map(card => card.city));
  if ("error" in result) throw new DestinationLoadError(result.error);
  const newCards = result.destinations;
  setDestinationSet(previous => ({
    ...previous,
    id: 1,
    cards: [...[...newCards].reverse(), ...previous.cards],
    allCards: previous.allCards.concat(newCards),
  }));
}
