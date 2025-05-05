// File: app/layout.tsx
import React from 'react';
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google"; // Use Inter font
import "./globals.css"; // Import global styles **MUST** be here
import SessionProvider from "@/components/providers/SessionProvider";
import Header from "@/components/layout/Header";
import { cn } from "@/lib/utils"; // Import cn utility

// Configure the font with a CSS variable
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "PassRecovAI",
  description: "AI-powered suggestions for your forgotten passwords",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    // Apply 'dark' class globally here for dark mode
    // Apply font variable for Tailwind font utility
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased", // Base styles
          fontSans.variable // Apply font CSS variable
        )}
      >
        <SessionProvider>
          {/* Use dvh for full dynamic viewport height */}
          <div className="relative flex min-h-dvh flex-col">
            <Header />
            {/* Add padding and max-width to main content area */}
            <main className="flex-1 container max-w-7xl mx-auto px-4 md:px-6 py-8">
                {children}
            </main>
            {/* Optional Footer */}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
