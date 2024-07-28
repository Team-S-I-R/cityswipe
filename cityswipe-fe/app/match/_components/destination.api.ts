import { Destination } from "@/lib/destination.type";

// Start of Selection
// Start of Selection
export const destination: Destination = {
  destinations: [
    { id: 8945, location: "Paris", rating: 0.36 },
    { id: 395309, location: "Rome", rating: 0.76 },
    { id: 23495, location: "Australia", rating: 0.56 },
    { id: 11104, location: "Bahamas", rating: 0.96 },
  ]
};

export const getDestination = async (): Promise<Destination> => {
  return destination;
};

export const clearDestination = async (): Promise<Destination> => {
  return destination;
};