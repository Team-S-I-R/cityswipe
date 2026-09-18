import { DestinationItem } from "@/lib/destination.type";
import { Destination, CardSwipeDirection } from "@/lib/destinationSet.type";

type Props = {
  direction: CardSwipeDirection | "";
  cards: Destination[];
  destinations: DestinationItem[];
};

const handleResponse = ({ direction, cards, destinations }: Props) => {
  const card = cards[cards.length - 1];
  return direction === "right" && card ? [...destinations, card] : destinations;

};

export default handleResponse;