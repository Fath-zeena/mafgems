// src/app/global-error.tsx
'use client';
import React from 'react';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>{error?.message ? `Error: ${error.message}` : 'An error occurred'}</h1>
          <p>Something went wrong globally. Please try again.</p>
          <button onClick={reset} style={{ marginTop: 16 }}>Try again</button>
        </div>
      </body>
    </html>
  );
}
