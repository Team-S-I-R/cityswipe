export type DestinationSet = {
   id: number;
   cards: Destination[];
 };
 
 export type Destination = {
   id?: number;
   location: string;
   description: string;
   rating: number|null;
  //  answer: "left" | "right";
  //  revised: string;
   illustration: string;
 };
 
 export type CardSwipeDirection = "left" | "right";
 export type IsDragOffBoundary = "left" | "right" | null;