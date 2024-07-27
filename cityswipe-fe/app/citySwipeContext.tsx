'use client'

import React, { createContext, useState, useContext } from 'react';

interface CitySwipeContextType {
  isStarted: boolean;
  isChatting?: boolean;
  isMatching?: boolean;
  setIsStarted: (value: boolean) => void;
  setIsChatting?: (value: boolean) => void;
  setIsMatching?: (value: boolean) => void;
}

const CitySwipeContext = createContext<CitySwipeContextType | null>(null);

export const CitySwipeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isStarted, setIsStarted] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [isMatching, setIsMatching] = useState(false);

  return (
    <CitySwipeContext.Provider value={{
      isStarted,
      isChatting,
      isMatching,
      setIsStarted,
      setIsChatting,
      setIsMatching
    }}>
      {children}
    </CitySwipeContext.Provider>
  );
};

export const useCitySwipe = () => {
  const context = useContext(CitySwipeContext);
  if (!context) throw new Error('useQuiz must be used within a QuizProvider');
  return context;
};
