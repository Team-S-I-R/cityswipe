"use client";
import { createContext, useContext, useState } from "react";
import { type Game } from "@/lib/games.type";

const useGameState = (initialGame: Game) => useState<Game>(initialGame);

const GameContext = createContext<ReturnType<typeof useGameState> | null>(null);

const GameProvider = ({
  game: initialGame,
  children,
}: {
  game: Game;
  children: React.ReactNode;
}) => {
  const [game, setGame] = useGameState(initialGame);

  return (
    <GameContext.Provider value={[game, setGame]}>
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;

export const useGameContext = () => {
  const game = useContext(GameContext);
  if (!game) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return game;
};