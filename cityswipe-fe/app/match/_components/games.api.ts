import { Game, Card } from "@/lib/games.type";

export const games: Game[] = [
  {
    id: 1,
    cards: [
      {
        id: 1,
        affirmation: "Paris",
        answer: "right",
        revised: //not required
          "It's true, 40% of car journeys are LESS than 3mi, which could be done on foot or by bike.",
        illustration: "car", //change to image link
        // add advantages and disadvantages
      },
      {
        id: 2,
        affirmation:
          "Japan",
        answer: "left",
        revised:
          "A bit less: a French produces on average 380kg of waste per year, which remains far too much.",
        illustration: "waste",
      },
      {
        id: 3,
        affirmation:
          "New York ",
        answer: "right",
        revised:
          "It's actually higher: a Paris-New York round trip emits approximately 1.75 tonnes of CO2 per passenger, the equivalent of 3 months of heating for a French person.",
        illustration: "plane",
      },
    ],
  },
];

export const getGames = async (): Promise<Game[]> => games;

export const getGame = async (gameId: number): Promise<Game> => {
  return { id: gameId, cards: reversedCards(games[gameId].cards) };
};

export const getInitialGame = (gameId: number) => {
  return { id: gameId, cards: reversedCards(games[gameId].cards) };
};

const reversedCards = (cards: Card[]) => {
  return cards
    .map((item, i) => {
      return { ...item, id: i + 1 };
    })
    .reverse();
};