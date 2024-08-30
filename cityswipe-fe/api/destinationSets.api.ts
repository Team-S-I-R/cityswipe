import { DestinationSet, Destination } from "@/lib/destinationSet.type";

export const destinationSets: DestinationSet[] = [
  {
    id: 1,
    cards: [
      {
        id: 1,
        location: "Rome",
        illustration: "car", //change to image link
        // description: "",
        rating: .80,
        description: ''
        // add advantages and disadvantages
      },
      {
        id: 2,
        location:
          "Japan",
        illustration: "waste",
        // description: "",
        rating: .80,
        description: '',
      },
      {
        id: 3,
        location:
          "New York ",
        illustration: "plane",
        // description: "",
        rating: .80,
        description: '',
      },
    ],
  },
];

export const getDestinationSets = async (): Promise<DestinationSet[]> => destinationSets;

export const getDestinationSet = async (destinationSetId: number): Promise<DestinationSet> => {
  return { id: destinationSetId, cards: reversedCards(destinationSets[destinationSetId].cards) };
};

export const getInitialSet = (destinationSetId: number) => {
  return { id: destinationSetId, cards: reversedCards(destinationSets[destinationSetId].cards) };
};

const reversedCards = (cards: Destination[]) => {
  return cards
    .map((item, i) => {
      return { ...item, id: i + 1 };
    })
    .reverse();
};