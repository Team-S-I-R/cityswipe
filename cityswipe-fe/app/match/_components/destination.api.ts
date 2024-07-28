import { Destination } from "@/lib/destination.type";

export const destination: Destination = {
  destinations: [],
};

export const getDestination = async (): Promise<Destination> => {
  return destination;
};

export const clearDestination = async (): Promise<Destination> => {
  return destination;
};