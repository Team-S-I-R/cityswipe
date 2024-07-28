export interface DestinationItem {
  id: number;
  location: string;
  rating: number | null;
}

export interface Destination {
  destinations: DestinationItem[];
}