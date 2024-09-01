export interface DestinationItem {
  id?: number;
  city: string;
  country: string;
  description: string;
  compatibility: number|null;
  pros: string[];
  cons: string[];
  illustration: string;
}

export interface Destination {
  destinations: DestinationItem[];
}