import { Game, Card } from "@/lib/games.type";

export const games: Game[] = [
  {
    id: 1,
    cards: [
      {
        id: 1,
        location: "Paris",
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