"use client";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-serif font-bold mb-6">
        Contact Us
      </h1>
      <p className="text-gray-700 max-w-2xl mb-8">
        Whether you are beginning a bespoke journey or have a question about an
        existing piece, our team is here to help.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          <textarea
            placeholder="How can we help?"
            rows={5}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="px-6 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Send Message
          </button>
        </form>
        <div className="text-gray-700 text-sm space-y-2">
          <p className="font-semibold">MAFGEMS Atelier</p>
          <p>123 Heritage Lane</p>
          <p>London, United Kingdom</p>
          <p className="mt-4">Phone: +44 (0) 1234 567 890</p>
          <p>Email: clientcare@mafgems.com</p>
        </div>
      </div>
    </div>
  );
}