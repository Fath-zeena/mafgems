"use client";

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-serif font-bold mb-6">
        Services
      </h1>
      <p className="text-gray-700 max-w-2xl mb-8">
        Our relationship with your jewelry does not end at purchase. MAFGEMS
        offers a range of services to care for your pieces throughout their
        lifetime.
      </p>
      <ul className="space-y-3 text-gray-700">
        <li>• Cleaning, polishing & routine inspections</li>
        <li>• Resizing & re-shanking</li>
        <li>• Stone tightening & replacement</li>
        <li>• Engraving & personalization</li>
        <li>• Repair of vintage MAFGEMS pieces</li>
      </ul>
    </div>
  );
}