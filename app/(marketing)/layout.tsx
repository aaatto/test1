    // File: app/(marketing)/layout.tsx
    import React from 'react';

    // This layout wraps static marketing pages (About, Contact, Privacy, Safety)
    export default function MarketingLayout({
      children,
    }: {
      children: React.ReactNode;
    }) {
      // For now, it just passes children through.
      // We could add specific wrappers or styles for marketing pages here later.
      return <>{children}</>;
    }
    