import { DestinationItem } from "@/lib/destination.type";
import { Card, CardSwipeDirection } from "@/lib/games.type";

type Props = {
  direction: CardSwipeDirection | "";
  cards: Card[];
  destinations: DestinationItem[];
};

const handleResponse = ({ direction, cards, destinations }: Props) => {
  const currentCard = cards[cards.length - 1];
  const choice = "right" === direction ? "true" : "false";
  // console.log("Choice:",choice);
  // console.log({id:currentCard.id, location:currentCard.location});
  choice ? destinations.push({id:cards.length-1, location:currentCard.location, rating:currentCard.rating}) : null;
  return destinations;
};

export default handleResponse;