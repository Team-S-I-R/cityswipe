import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CitySwipeProvider } from './citySwipeContext';
import "./globals.css";
import GameProvider from "./match/_components/gameContext";
import { getGame } from "./match/_components/games.api";
import SavedDestinationProvider from "./match/_components/savedDestinationContext";
import { getDestination } from "./match/_components/savedDestination.api";
import { Analytics } from '@vercel/analytics/react';


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
  const savedDestination = await getDestination();
  return (
    <html lang="en" className="overflow-hidden">
      <body className={`${inter.className}`}>
      <Analytics />
        <CitySwipeProvider>
          <SavedDestinationProvider savedDestination={savedDestination}>
            <GameProvider game={game}>{children}</GameProvider>
          </SavedDestinationProvider>
        </CitySwipeProvider>
      </body>
    </html>
  );
}
