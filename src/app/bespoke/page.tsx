"use client";

export default function BespokePage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-serif font-bold mb-6">
        Bespoke Design
      </h1>
      <p className="text-gray-700 max-w-2xl mb-8">
        For over 40 years, MAFGEMS has crafted one-of-a-kind pieces that capture
        personal stories and milestones. Our bespoke service guides you from
        inspiration to a finished jewel that is uniquely yours.
      </p>
      <ol className="list-decimal list-inside space-y-3 text-gray-700">
        <li>Share your inspiration and requirements.</li>
        <li>Review initial concepts and sketches.</li>
        <li>Refine the design with our master designers.</li>
        <li>Approve the final 3D render and gemstones.</li>
        <li>Receive your finished piece with full certification.</li>
      </ol>
    </div>
  );
}