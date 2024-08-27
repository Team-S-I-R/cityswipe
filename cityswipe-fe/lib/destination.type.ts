export interface DestinationItem {
  id: number;
  location: string;
  rating: number | null;
  illustration?: string;
}

export interface Destination {
  destinations: DestinationItem[];
}