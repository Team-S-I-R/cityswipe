import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CitySwipeProvider } from './citySwipeContext';
import "./globals.css";
import GameProvider from "./match/_components/gameContext";
import { getGame } from "./match/_components/games.api";
import DestinationProvider from "./match/_components/destinationContext";
import { getDestination } from "./match/_components/destination.api";
import { Analytics } from '@vercel/analytics/react';
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CitySwipe",
  description: "Allowing you to find your perfect holiday destination match!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const game = await getGame(0);
  const destination = await getDestination();
  return (
    <ClerkProvider>
      <html lang="en" className="overflow-hidden">
        <body className={`${inter.className}`}>
        <Analytics />
          <CitySwipeProvider>
            <DestinationProvider destination={destination}>
              <GameProvider game={game}>     
                  {children}
                </GameProvider>
            </DestinationProvider>
          </CitySwipeProvider>
        </body>
      </html>
    </ClerkProvider>
  ); 
}
