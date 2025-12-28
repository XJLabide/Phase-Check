import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { TrackerProvider } from "@/context/TrackerContext";
import { ToastProvider } from "@/context/ToastContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Phase Check - Track Your MCU Journey",
  description: "A personalized progress-tracking app for your Marvel Cinematic Universe watch journey. Track movies, series, and specials across all phases and sagas.",
  keywords: ["MCU", "Marvel", "tracker", "movies", "series", "Avengers", "Iron Man", "watch order", "Phase Check"],
  authors: [{ name: "Phase Check" }],
  openGraph: {
    title: "Phase Check - Track Your MCU Journey",
    description: "Track your MCU watch progress across all phases and sagas",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased min-h-screen`}
      >
        <ToastProvider>
          <TrackerProvider>
            {children}
          </TrackerProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

