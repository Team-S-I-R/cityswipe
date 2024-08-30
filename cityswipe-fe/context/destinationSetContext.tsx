"use client";
import { createContext, useContext, useState } from "react";
import { type DestinationSet } from "@/lib/destinationSet.type";

const useDestinationSetState = (initialDestination: DestinationSet) => useState<DestinationSet>(initialDestination);

const DestinationSetContext = createContext<ReturnType<typeof useDestinationSetState> | null>(null);

const DestinationSetProvider = ({
  destinationSet: initialDestinationSet,
  children,
}: {
  destinationSet: DestinationSet;
  children: React.ReactNode;
}) => {
  const [destinationSet, setDestinationSet] = useDestinationSetState(initialDestinationSet);

  return (
    <DestinationSetContext.Provider value={[destinationSet, setDestinationSet]}>
      {children}
    </DestinationSetContext.Provider>
  );
};

export default DestinationSetProvider;

export const useDestinationSetContext = () => {
  const destinationSet = useContext(DestinationSetContext);
  if (!destinationSet) {
    throw new Error("useDestinationSetContext must be used within a DestinationSetProvider");
  }
  return destinationSet;
};