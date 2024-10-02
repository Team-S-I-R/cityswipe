export type DestinationSet = {
   id: number;
   cards: Destination[];
   allCards: Destination[];
   responses: string[];
 };
 
 export type Destination = {
   id?: number;
   city: string;
   country: string;
   description: string;
   compatibility: number|null;
   budget?: number
   pros: string[];
   cons: string[];
  //  answer: "left" | "right";
  //  revised: string;
   illustration: string;
 };
 
 export type CardSwipeDirection = "left" | "right";
 export type IsDragOffBoundary = "left" | "right" | null;