// File: components/auth/LoginForm.tsx (CSS Module Version)
"use client";

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Chrome, Loader2 } from 'lucide-react';
import styles from './AuthForm.module.css'; // Import shared styles

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const error = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(error ? 'Authentication failed. Please check credentials.' : null);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true); setFormError(null);
    try {
      const result = await signIn('credentials', { redirect: false, email, password, callbackUrl });
      if (result?.error) { setFormError('Invalid email or password.'); setIsLoading(false); }
      else if (result?.ok && result?.url) { router.push(result.url); }
      else { setFormError('An unexpected error occurred.'); setIsLoading(false); }
    } catch (error) { setFormError('Login error. Please try again.'); setIsLoading(false); }
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true); signIn('google', { callbackUrl: callbackUrl });
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Login</h2>
        <p className={styles.description}>Access your account</p>
      </div>

      {formError && ( <div className={styles.errorMessage}>{formError}</div> )}

      <form onSubmit={handleCredentialsLogin} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input id="email" type="email" className={styles.input} placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input id="password" type="password" className={styles.input} placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
        </div>
        <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`} disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : null}
          {isLoading ? 'Logging in...' : 'Login with Email'}
        </button>
      </form>

      <div className={styles.divider}>
        <div className={styles.dividerLine}></div>
        <span className={styles.dividerText}>Or continue with</span>
        <div className={styles.dividerLine}></div>
      </div>

      <button className={`${styles.button} ${styles.buttonOutline}`} onClick={handleGoogleSignIn} disabled={isLoading}>
        <Chrome /> {isLoading ? 'Redirecting...' : 'Login with Google'}
      </button>

      <div className={styles.footer}>
         Don't have an account?
         <Link href="/register" className={styles.footerLink}>Register here</Link>
       </div>
    </div>
  );
}
