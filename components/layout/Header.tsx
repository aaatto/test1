// File: components/layout/Header.tsx (CSS Module Version)
"use client";

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { LogIn, LogOut, UserPlus, CreditCard, PlusCircle } from 'lucide-react';
import styles from './Header.module.css'; // Import the CSS Module

export default function Header() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  return (
    <header className={styles.siteHeader}>
      <div className={styles.container}>
        <div style={{ display: 'flex' }}> {/* Keep basic flex for logo area */}
          <Link href="/" className={styles.logoLink}>
            <span>PassRecovAI</span>
          </Link>
        </div>

        <nav className={styles.mainNav}>
          <Link href="/privacy">Privacy</Link>
          <Link href="/about">About Us</Link>
          <Link href="/safety">Safety</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <div className={styles.headerRight}>
          {isLoading ? (
            <div style={{ height: '32px', width: '100px', backgroundColor: 'var(--muted-bg)', borderRadius: 'var(--radius-md)' }}></div>
          ) : session ? (
            <>
              <div className={styles.creditsDisplay}>
                <CreditCard />
                Credits: {session.user.credits ?? 0}
                <Link href="/buy-credits" className={styles.buyCreditsButton} aria-label="Buy Credits">
                   <PlusCircle />
                </Link>
              </div>
              <span className={styles.userName}>Hi, {session.user.name || 'User'}</span>
              {/* Apply scoped button classes */}
              <button className={`${styles.button} ${styles.buttonGhost}`} onClick={() => signOut()}>
                <LogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                {/* Apply scoped button classes */}
                <button className={`${styles.button} ${styles.buttonGhost}`}>
                  <LogIn /> Login
                </button>
              </Link>
              <Link href="/register">
                 {/* Apply scoped button classes */}
                <button className={`${styles.button} ${styles.buttonPrimary}`}>
                  <UserPlus /> Register
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
