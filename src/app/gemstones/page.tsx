import React from 'react';

export default function GemstonesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Exquisite Gemstones</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {['Sapphire', 'Ruby', 'Emerald', 'Diamond', 'Topaz', 'Amethyst'].map((gem) => (
          <div key={gem} className="border p-6 rounded-lg text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              <div className="w-8 h-8 bg-primary/20 rotate-45" />
            </div>
            <h3 className="font-semibold">{gem}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}