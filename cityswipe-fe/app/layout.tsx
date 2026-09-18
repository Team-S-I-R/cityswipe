import type { Metadata } from "next";
import localFont from "next/font/local";
import { CitySwipeProvider } from './citySwipeContext';
import "./globals.css";
import DestinationSetProvider from "../context/destinationSetContext";
import { getDestinationSet } from "../api/destinationSets.api";
import SavedDestinationProvider from "../context/savedDestinationContext";
import { getDestination } from "../api/savedDestination.api";
import { Analytics } from '@vercel/analytics/react';
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster"

const satoshi = localFont({
  src: "./assets/fonts/Satoshi_Complete/Fonts/WEB/fonts/Satoshi-Variable.woff2",
  weight: "300 900",
  display: "swap",
});

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
    <ClerkProvider
    signInFallbackRedirectUrl={"/quiz"}
    signUpFallbackRedirectUrl={"/quiz"}
    >
      <html lang="en" className="overflow-hidden">
        <body className={satoshi.className}>
          <Toaster  />
        <Analytics />
          <CitySwipeProvider>
            <SavedDestinationProvider savedDestination={savedDestination}>
              <DestinationSetProvider destinationSet={destinationSet}>{children}</DestinationSetProvider>
            </SavedDestinationProvider>
          </CitySwipeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
