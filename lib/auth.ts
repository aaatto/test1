// File: lib/auth.ts
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type NextAuthOptions, type User as NextAuthUser } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "./db";
import bcrypt from "bcryptjs";
import { Adapter } from "next-auth/adapters"; // Import Adapter type

// Extend NextAuth types
declare module "next-auth" {
  interface User {
    id: string;
    credits?: number;
  }
  interface Session {
    user: User & {
      id: string;
      credits: number;
    };
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    credits: number;
  }
}

export const authOptions: NextAuthOptions = {
  // Use Prisma Adapter, casting to Adapter type to help TypeScript
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<NextAuthUser | null> {
        if (!credentials?.email || !credentials.password) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) return null; // No user or user signed up via OAuth

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        if (!isValidPassword) return null;

        // Return user object for JWT callback
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          credits: user.credits, // Pass credits
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/login', // Redirect to /login page for signin
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) { // On initial sign in
        token.id = user.id;
        token.credits = (user as any).credits ?? 0; // Add credits from user obj
      }
      if (trigger === "update" && session?.credits) { // On session update trigger
         token.credits = session.credits;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.credits = token.credits; // Add credits from token to session
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Secret for JWT signing
  debug: process.env.NODE_ENV === 'development',
};
