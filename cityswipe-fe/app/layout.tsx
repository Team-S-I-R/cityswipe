import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CitySwipeProvider } from './citySwipeContext';
import "./globals.css";
import DestinationSetProvider from "../context/destinationSetContext";
import { getDestinationSet } from "../api/destinationSets.api";
import SavedDestinationProvider from "../context/savedDestinationContext";
import { getDestination } from "../api/savedDestination.api";
import { Analytics } from '@vercel/analytics/react';
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster"
import { PostHogProviderWrapper } from "./providers";

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
      <ClerkProvider
        signInFallbackRedirectUrl={"/quiz"}
        signUpFallbackRedirectUrl={"/quiz"}
        >
          <PostHogProviderWrapper>
            <html lang="en" className="overflow-hidden">
              <body className={`${inter.className}`}>
                  <Toaster  />
                  <Analytics />
                    <CitySwipeProvider>
                      <SavedDestinationProvider savedDestination={savedDestination}>
                        <DestinationSetProvider destinationSet={destinationSet}>{children}</DestinationSetProvider>
                      </SavedDestinationProvider>
                    </CitySwipeProvider>
              </body>
            </html>
          </PostHogProviderWrapper>
      </ClerkProvider>
  );
}
