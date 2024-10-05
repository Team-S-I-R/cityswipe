'use client'

import React, { createContext, useState, useContext } from 'react';
import { Message } from './actions';

interface CitySwipeContextType {
  isStarted: boolean;
  isChatting?: boolean;
  isMatching?: boolean;
  firstMatch?: string;
  isSidebarOpen: boolean;
  isItineraryModalOpen: boolean;
  subscriptionStatus?: string
  subscriptionPlanId?: string
  userdata?: any;
  usermatches?: any
  userquestions?: any
  userItinerary?: any
  currentPath?: string
  addingItemToItinerary?: boolean
  newItineraryItem?: string
  photoUrl?: string[];
  chatImg?: string;
  selectedMatch?: string;
  selectedBio?: string;
  selectedCompatibility?: number;
  selectedPros?: any[];
  selectedCons?: any[];
  message: Message[];
  clearConversation?: number
  setClearConversation?: (value: number) => void
  setMessage: React.Dispatch<React.SetStateAction<any>>
  setIsStarted: (value: boolean) => void;
  setCurrentPath?: (value: string) => void;
  setSubscriptionPlanId?: (value: string) => void;
  setSubscriptionStatus?: (value: string) => void;
  setUserData?: (value: any) => void;
  setUserMatches?: (value: any) => void;
  setUserQuestions?: (value: any) => void;
  setUserItinerary?: (value: any) => void;
  setNewItineraryItem?: (value: string) => void;
  setAddingItemToItinerary?: (value: boolean) => void;
  setSelectedCompatibility?: (value: number) => void;
  setSelectedBio?: (value: string) => void;
  setIsSidebarOpen: (value: boolean) => void;
  setIsItineraryModalOpen: (value: boolean) => void;
  setSelectedPros?: (value: string[]) => void;
  setSelectedCons?: (value: string[]) => void;
  setPhotoUrl?: React.Dispatch<React.SetStateAction<string[]>>;  // Updated type
  setChatImg?: (value: string) => void;
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string[]>([]);
  const [isItineraryModalOpen, setIsItineraryModalOpen] = useState(false);
  const [newItineraryItem, setNewItineraryItem] = useState<string>('');
  const [addingItemToItinerary, setAddingItemToItinerary] = useState(false);
  const [userdata, setUserData] = useState<any>({});
  const [subscriptionPlanId, setSubscriptionPlanId] = useState<string>('');
  const [userItinerary, setUserItinerary] = useState<any>({});
  const [selectedCompatibility, setSelectedCompatibility] = useState<number>(0);
  const [selectedBio, setSelectedBio] = useState<string>('');
  const [selectedPros, setSelectedPros] = useState<any[]>([]);
  const [selectedCons, setSelectedCons] = useState<any[]>([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('');
  const [usermatches, setUserMatches] = useState<any>([]);
  const [userquestions, setUserQuestions] = useState<any>([]);
  const [chatImg, setChatImg] = useState<string>('');
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
      chatImg,
      userItinerary,
      subscriptionStatus,
      subscriptionPlanId,
      userdata,
      currentPath,
      usermatches,
      userquestions,
      newItineraryItem,
      addingItemToItinerary,
      isSidebarOpen,
      isItineraryModalOpen,
      isMatching,
      selectedMatch,
      selectedCompatibility,
      selectedBio,
      selectedPros,
      selectedCons,
      firstMatch,
      clearConversation,
      setMessage,
      setFirstMatch,
      setIsStarted,
      setPhotoUrl,
      setSubscriptionPlanId,
      setCurrentPath,
      setIsSidebarOpen,
      setIsItineraryModalOpen,
      setUserItinerary,
      setSubscriptionStatus,
      setUserData,
      setUserMatches,
      setNewItineraryItem,
      setAddingItemToItinerary,
      setUserQuestions,
      setSelectedBio,
      setSelectedPros,
      setSelectedCons,
      setSelectedCompatibility,
      setChatImg,
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
