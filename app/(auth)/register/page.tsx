    // File: app/(auth)/register/page.tsx (Plain CSS Version)
    import React from 'react';
    import RegisterForm from '@/components/auth/RegisterForm';

    export default function RegisterPage() {
      return (
         // Basic centering styles
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 3.5rem)', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <RegisterForm />
        </div>
      );
    }
    