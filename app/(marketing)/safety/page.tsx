    // File: app/(marketing)/safety/page.tsx
    import React from 'react';

    export default function SafetyPage() {
      return (
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1rem' }}>Safety Information</h1>
          <p style={{ color: 'var(--text-muted-color)' }}>
            Content about the safety and security of using the tool will go here.
            We prioritize user privacy and do not store sensitive hint data.
            {/* Add more detailed safety content */}
          </p>
        </div>
      );
    }
    