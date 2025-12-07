"use client";

export default function CollectionsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-serif font-bold mb-6">
        Collections
      </h1>
      <p className="text-gray-700 max-w-2xl mb-8">
        Discover signature collections crafted over 40 years of MAFGEMS heritage.
        This page will showcase curated lines of rings, necklaces, earrings and
        bracelets, each with its own story.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-48 bg-gray-200 rounded-lg" />
        <div className="h-48 bg-gray-200 rounded-lg" />
        <div className="h-48 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}