export interface DestinationItem {
  id?: number;
  city: string;
  country: string;
  description: string;
  compatibility: number|null;
  budget?: number;
  pros: string[];
  cons: string[];
  illustration: string;
}

export interface Destination {
  destinations: DestinationItem[];
}

/** Result of the destination-generating server action: suggestions, or a message safe to show the traveler. */
export type DestinationGenerationResult =
  | { destinations: DestinationItem[] }
  | { error: string };