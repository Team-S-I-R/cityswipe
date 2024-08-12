'use client'

import React, { createContext, useState, useContext } from 'react';
import { Message } from './actions';

interface CitySwipeContextType {
  isStarted: boolean;
  isChatting?: boolean;
  isMatching?: boolean;
  firstMatch?: string;
  photoUrl?: string[];
  selectedMatch?: string;
  message: Message[];
  clearConversation?: number
  setClearConversation?: (value: number) => void
  setMessage: React.Dispatch<React.SetStateAction<any>>
  setIsStarted: (value: boolean) => void;
  setPhotoUrl?: React.Dispatch<React.SetStateAction<string[]>>;  // Updated type
  setIsChatting?: (value: boolean) => void;
  setIsMatching?: (value: boolean) => void;
  setSelectedMatch?: (value: string) => void;
  setFirstMatch?: (value: string) => void;
}

const CitySwipeContext = createContext<CitySwipeContextType | null>(null);

export const CitySwipeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isStarted, setIsStarted] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<string>('');
  const [firstMatch, setFirstMatch] = useState<string>('');
  const [clearConversation, setClearConversation] = useState(0);
  const [message, setMessage] = useState<Array<any>>([]);

  return (
    <CitySwipeContext.Provider value={{
      message,
      isStarted,
      isChatting,
      photoUrl,
      isMatching,
      selectedMatch,
      firstMatch,
      clearConversation,
      setMessage,
      setFirstMatch,
      setIsStarted,
      setPhotoUrl,
      setIsChatting,
      setIsMatching,
      setSelectedMatch,
      setClearConversation,
    }}>
      {children}
    </CitySwipeContext.Provider>
  );
};

export const useCitySwipe = (match?: string) => {
  const context = useContext(CitySwipeContext);
  if (!context) throw new Error('useQuiz must be used within a QuizProvider');
  return context;
};
