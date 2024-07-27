'use client'

import React, { createContext, useState, useContext } from 'react';

interface QuizContextType {
  isStarted: boolean;
  setIsStarted: (value: boolean) => void;
}

const QuizContext = createContext<QuizContextType | null>(null);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isStarted, setIsStarted] = useState(false);

  return (
    <QuizContext.Provider value={{ isStarted, setIsStarted }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) throw new Error('useQuiz must be used within a QuizProvider');
  return context;
};