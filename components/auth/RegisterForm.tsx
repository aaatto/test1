// File: components/auth/RegisterForm.tsx (CSS Module Version)
"use client";

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Chrome, Loader2 } from 'lucide-react';
import styles from './AuthForm.module.css'; // Import shared styles

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null); setSuccess(null);
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters long."); return; }
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }), });
      const data = await response.json();
      if (!response.ok) { setError(data.message || 'Registration failed.'); }
      else {
        setSuccess('Registration successful! Logging you in...');
        const signInResult = await signIn('credentials', { redirect: false, email, password, });
        if (signInResult?.ok) { router.push('/dashboard'); }
        else { setError('Registration successful, but auto-login failed. Please log in.'); }
      }
    } catch (err) { setError('An unexpected error occurred.'); }
    finally { setIsLoading(false); }
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true); signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Create Account</h2>
        <p className={styles.description}>Enter details to register</p>
      </div>

      {error && ( <div className={styles.errorMessage}>{error}</div> )}
      {success && ( <div className={styles.successMessage}>{success}</div> )}

      <form onSubmit={handleRegister} className={styles.form}>
         <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>Name (Optional)</label>
          <input id="name" type="text" className={styles.input} placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input id="email" type="email" className={styles.input} placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input id="password" type="password" className={styles.input} placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
        </div>
         <div className={styles.formGroup}>
          <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
          <input id="confirmPassword" type="password" className={styles.input} placeholder="********" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isLoading} />
        </div>
        <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`} disabled={isLoading}>
           {isLoading ? <Loader2 className="animate-spin" /> : null}
           {isLoading ? 'Registering...' : 'Create Account'}
        </button>
      </form>

       <div className={styles.divider}>
         <div className={styles.dividerLine}></div>
         <span className={styles.dividerText}>Or register with</span>
         <div className={styles.dividerLine}></div>
       </div>

      <button className={`${styles.button} ${styles.buttonOutline}`} onClick={handleGoogleSignIn} disabled={isLoading}>
        <Chrome /> {isLoading ? 'Redirecting...' : 'Register with Google'}
      </button>

      <div className={styles.footer}>
        Already have an account?
        <Link href="/login" className={styles.footerLink}>Login here</Link>
      </div>
    </div>
  );
}
