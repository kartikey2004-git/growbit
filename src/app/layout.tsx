/* eslint-disable @typescript-eslint/ban-ts-comment */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

//@ts-ignore
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Growbit",
  description: "Habit tracking that keeps you consistent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        ]<QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}

// TanStack Query : also used in project for powerful asynchronous state management, server-state utilities and data fetching
