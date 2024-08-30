import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CitySwipeProvider } from './citySwipeContext';
import "./globals.css";
import GameProvider from "../context/destinationSetContext";
import { getDestinationSet } from "../api/destinationSets.api";
import SavedDestinationProvider from "../context/savedDestinationContext";
import { getDestination } from "../api/savedDestination.api";
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
  const destinationSet = await getDestinationSet(0);
  const savedDestination = await getDestination();
  return (
    <html lang="en" className="overflow-hidden">
      <body className={`${inter.className}`}>
      <Analytics />
        <CitySwipeProvider>
          <SavedDestinationProvider savedDestination={savedDestination}>
            <GameProvider destinationSet={destinationSet}>{children}</GameProvider>
          </SavedDestinationProvider>
        </CitySwipeProvider>
      </body>
    </html>
  );
}
