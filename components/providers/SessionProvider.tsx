// File: components/providers/SessionProvider.tsx
"use client"; // Mark as Client Component

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import React from "react";

interface Props {
  children: React.ReactNode;
}

// Simple wrapper around NextAuth's SessionProvider
export default function SessionProvider({ children }: Props) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
