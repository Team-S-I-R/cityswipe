import { Card, CardSwipeDirection } from "@/lib/games.type";

type Props = {
  direction: CardSwipeDirection | "";
  cards: Card[];
  destinations: Object[];
};

const handleResponse = ({ direction, cards, destinations }: Props) => {
  const currentCard = cards[cards.length - 1];
  const choice = "right" === direction ? "true" : "false";
  console.log(choice);
  console.log({id:currentCard.id, location:currentCard.affirmation});
  choice ? destinations.push({id:cards.length-1, location:currentCard.affirmation}) : null;
  return destinations;
};

export default handleResponse;