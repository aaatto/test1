// File: app/(main)/dashboard/page.tsx
import React from 'react';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth/next';
import MultiStepForm from '@/components/password-generator/MultiStepForm'; // Import the form

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    // Ideally handle this with middleware later
    return (
       <div className="container mx-auto p-6 text-center">
         <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
         <p>You must be logged in to view this page.</p>
         {/* TODO: Add a link/button to redirect to login */}
       </div>
    );
  }

  // Check if user has credits
  const hasCredits = (session.user?.credits ?? 0) > 0;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 pb-4 border-b">
         <h1 className="text-3xl font-bold">Password Recovery Tool</h1>
         <p className="text-muted-foreground">
             Welcome, {session.user?.name || 'User'}! Let's find that password.
         </p>
         {/* Display credits prominently */}
         <p className="text-sm mt-1">
             Available Credits: <span className="font-semibold">{session.user?.credits ?? 0}</span>
             {/* TODO: Add link/button to buy credits */}
         </p>
      </div>


      {/* Conditionally render the form or a message based on credits */}
      {hasCredits ? (
         <MultiStepForm />
      ) : (
         <div className="text-center p-8 border rounded-lg bg-card text-card-foreground shadow-sm">
             <h2 className="text-xl font-semibold mb-3">Out of Credits</h2>
             <p className="text-muted-foreground mb-4">
                 You need credits to use the password suggestion tool.
             </p>
             {/* TODO: Add Button linking to /buy-credits page */}
             <button className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium">
                 Buy Credits
             </button>
         </div>
      )}

      {/* Placeholder for displaying generated password results later */}
      {/* <PasswordResultsDisplay results={...} /> */}

    </div>
  );
}
