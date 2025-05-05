// File: app/page.tsx (Plain CSS Version)
import React from 'react';

export default function HomePage() {
  return (
    // Use basic styles or inline styles
    <div style={{ textAlign: 'center', paddingTop: '5rem' }}>
      <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Welcome to AI Password Helper
      </h1>
      <p style={{ fontSize: '1.125rem', color: 'var(--muted-text)' }}>
        Let's help you find that forgotten password.
      </p>
      {/* Login/Register buttons or links will be added here later */}
      {/* They will need styling via CSS classes like .button */}
    </div>
  );
}
