import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TravelProvider } from "@/contexts/TravelContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "DreamVoyager Travel - AI-Powered Travel Planning",
  description: "Discover your perfect trip with our intelligent AI travel assistant. Get personalized recommendations, detailed itineraries, and budget-friendly options for unforgettable adventures.",
  keywords: ["travel", "AI", "vacation planning", "travel assistant", "itinerary", "destinations"],
  authors: [{ name: "DreamVoyager Travel" }],
  openGraph: {
    title: "DreamVoyager Travel - AI-Powered Travel Planning",
    description: "Discover your perfect trip with our intelligent AI travel assistant.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <TravelProvider>
          {children}
        </TravelProvider>
      </body>
    </html>
  );
}
