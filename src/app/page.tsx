"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="relative flex flex-col items-center justify-center text-center min-h-[calc(100vh-80px)] bg-gray-100 px-4 py-10">
      {/* Placeholder hero background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{
          backgroundImage:
            "url('https://placehold.co/1920x1080/EBF4FA/333?text=Exquisite+Jewellery')",
        }}
      ></div>

      <div className="relative max-w-4xl p-6 md:p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-2xl">
        <h1 className="text-4xl md:text-6xl font-serif font-extrabold tracking-tight text-gray-900">
          The Art of Bespoke Luxury
        </h1>
        <p className="mt-6 text-lg md:text-2xl text-gray-700 font-light">
          40 years of heritage meets the future of design. Create your unique
          masterpiece with our AI-powered customiser.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/customizer">
            <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6">
              Design Your Ring
            </Button>
          </Link>
          <Link href="/collections">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-lg px-8 py-6"
            >
              View Collections
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}