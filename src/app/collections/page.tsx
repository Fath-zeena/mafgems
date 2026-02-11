import React from 'react';

export default function CollectionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Our Collections</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="group relative overflow-hidden rounded-lg border bg-card aspect-[4/5] flex items-center justify-center">
            <span className="text-muted-foreground">Collection Item {i}</span>
          </div>
        ))}
      </div>
    </div>
  );
}