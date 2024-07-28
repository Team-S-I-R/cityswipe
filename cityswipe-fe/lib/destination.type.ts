export interface DestinationItem {
  id: number;
  location: string;
  rating: number;
}

export interface Destination {
  destinations: DestinationItem[];
}