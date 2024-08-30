"use client";
import { createContext, useContext, useState } from "react";
import { Destination } from "@/lib/destination.type";

const useSavedDestinationState = (initialDestination: Destination) => useState<Destination>(initialDestination);

const SavedDestinationContext = createContext<ReturnType<typeof useSavedDestinationState> | null>(null);

const SavedDestinationProvider = ({
  savedDestination: initialDestination,
  children,
}: {
  savedDestination: Destination;
  children: React.ReactNode;
}) => {
  const [savedDestination, setSavedDestination] = useSavedDestinationState(initialDestination);

  return (
    <SavedDestinationContext.Provider value={[savedDestination, setSavedDestination]}>
      {children}
    </SavedDestinationContext.Provider>
  );
};

export default SavedDestinationProvider;

export const useSavedDestinationContext = () => {
  const savedDestination = useContext(SavedDestinationContext);
  if (!savedDestination) {
    throw new Error("useSavedDestinationContext must be used within a SavedDestinationProvider");
  }
  return savedDestination;
};