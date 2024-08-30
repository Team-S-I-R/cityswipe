import { Destination } from "@/lib/destination.type";

export const savedDestination: Destination = {
  destinations: [
  ]
};

export const getDestination = async (): Promise<Destination> => {
  return savedDestination;
};

export const clearDestination = async (): Promise<Destination> => {
  return savedDestination;
};