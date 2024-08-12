export interface DestinationItem {
  id: number;
  location: string;
  rating: number | null;
  img?: string;
}

export interface Destination {
  destinations: DestinationItem[];
}