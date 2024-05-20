import "@/styles/globals.css";
import { Caudex, Eczar, Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";
import { Metadata } from "next";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const eczar = Eczar({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-eczar",
});
const caudex = Caudex({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  variable: "--font-caudex",
});

export const metadata: Metadata = {
  title: "Polaroid Gallery",
  description: "Upload and view your images in a Polaroid-style grid.",
  applicationName: "Polaroid Gallery",
  authors: [
    {
      name: "Weslley Rocha",
      url: "https://github.com/WeslleyNasRocha/",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          eczar.variable + " " + caudex.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
