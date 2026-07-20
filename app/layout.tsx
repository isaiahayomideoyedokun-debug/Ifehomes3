import type { Metadata } from "next";
import { Fraunces, Instrument_Sans, Space_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
});
const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  weight: ["400", "500", "600", "700"],
});
const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Ife Homes — Rooms, apartments & roommates around campus",
  description:
    "Ife Homes connects agents with verified rooms and flats near campus to students looking for a place, or a roommate to share it with.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${instrument.variable} ${spaceMono.variable}`}>
      <body className="font-body">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
