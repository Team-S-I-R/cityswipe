"use client";
import { createContext, useContext, useState } from "react";
import { Destination } from "@/lib/destination.type";

const useDestinationState = (initialDestination: Destination) => useState<Destination>(initialDestination);

const DestinationContext = createContext<ReturnType<typeof useDestinationState> | null>(null);

const DestinationProvider = ({
  destination: initialDestination,
  children,
}: {
  destination: Destination;
  children: React.ReactNode;
}) => {
  const [destination, setDestination] = useDestinationState(initialDestination);

  return (
    <DestinationContext.Provider value={[destination, setDestination]}>
      {children}
    </DestinationContext.Provider>
  );
};

export default DestinationProvider;

export const useDestinationContext = () => {
  const destination = useContext(DestinationContext);
  if (!destination) {
    throw new Error("useDestinationContext must be used within a DestinationProvider");
  }
  return destination;
};