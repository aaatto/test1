    // File: app/(auth)/login/page.tsx (Plain CSS Version)
    import React from 'react';
    import LoginForm from '@/components/auth/LoginForm';

    export default function LoginPage() {
      return (
        // Basic centering styles
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 3.5rem)', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <LoginForm />
        </div>
      );
    }
    