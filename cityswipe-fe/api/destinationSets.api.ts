import { DestinationSet, Destination } from "@/lib/destinationSet.type";

export const destinationSets: DestinationSet[] = [
  {
    id: 0,
    cards: [
    //   {
    //     id: 0,
    //     city: "Tokyo",
    //     country: "Japan",
    //     compatibility: 85,
    //     illustration: "https://images.pexels.com/photos/27079241/pexels-photo-27079241.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    //     description: "Tokyo is a bustling metropolis with a rich history and culture. It is the capital of Japan and is known for its modern architecture, vibrant nightlife, and delicious food. The city is home to the famous Tokyo Tower and the Senso-ji Temple. Tokyo is also known for its fashion and technology industries. The city is a great place to visit for anyone interested in history, culture, or modern life.",
    //     pros: ["Rich history", "Modern architecture", "Vibrant nightlife", "Delicious food", "Famous landmarks", "Fashion industry", "Technology industry", "Historical sites", "Cultural attractions", "Entertainment options"],
    //     cons: ["Crowded", "Expensive", "Pollution", "Language barrier", "Lack of green spaces", "High cost of living", "Long working hours", "Traffic congestion", "Limited public transportation", "Limited public transportation"],
    //   },
    //   {
    //     id: 1,
    //     city: "Paris",
    //     country: "France",
    //     compatibility: 85,
    //     illustration: "https://images.pexels.com/photos/26579666/pexels-photo-26579666.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    //     description: "Paris is a city known for its art, fashion, and romance. It is the capital of France and is known for its beautiful architecture, delicious food, and romantic atmosphere. The city is home to the famous Eiffel Tower and the Louvre Museum. Paris is also known for its fashion and art industries. The city is a great place to visit for anyone interested in history, culture, or modern life.",
    //     pros: ["Beautiful architecture", "Delicious food", "Romantic atmosphere", "Art and fashion", "Historical sites", "Cultural attractions", "Entertainment options", "Museums", "Restaurants", "Parks"],
    //     cons: ["Expensive", "Crowded", "Language barrier", "Lack of green spaces", "High cost of living", "Long working hours", "Traffic congestion", "Limited public transportation", "Limited public transportation"],
    // },
    //   {
    //     id: 2,
    //     city: "Chile",
    //     country: "Japan",
    //     compatibility: 85,
    //     illustration: '',
    //     description: "Tokyo is a bustling metropolis with a rich history and culture. It is the capital of Japan and is known for its modern architecture, vibrant nightlife, and delicious food. The city is home to the famous Tokyo Tower and the Senso-ji Temple. Tokyo is also known for its fashion and technology industries. The city is a great place to visit for anyone interested in history, culture, or modern life.",
    //     pros: ["Rich history", "Modern architecture", "Vibrant nightlife", "Delicious food", "Famous landmarks", "Fashion industry", "Technology industry", "Historical sites", "Cultural attractions", "Entertainment options"],
    //     cons: ["Crowded", "Expensive", "Pollution", "Language barrier", "Lack of green spaces", "High cost of living", "Long working hours", "Traffic congestion", "Limited public transportation", "Limited public transportation"],
    //   },
    ],
    allCards: [],
    responses: [],
  },
];

export const getDestinationSets = async (): Promise<DestinationSet[]> => destinationSets;

export const getDestinationSet = async (destinationSetId: number): Promise<DestinationSet> => {
  return { id: destinationSetId, cards: reversedCards(destinationSets[destinationSetId].cards), allCards: reversedCards(destinationSets[destinationSetId].allCards), responses: destinationSets[destinationSetId].responses};
};

export const getInitialSet = (destinationSetId: number) => {
  return { id: destinationSetId, cards: reversedCards(destinationSets[destinationSetId].cards), allCards: reversedCards(destinationSets[destinationSetId].allCards), responses: destinationSets[destinationSetId].responses};
};

const reversedCards = (cards: Destination[]) => {
  return cards
    .map((item, i) => {
      return { ...item, id: i + 1 };
    })
    .reverse();
};