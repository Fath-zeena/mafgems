"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="relative flex flex-col items-center justify-center text-center min-h-[calc(100vh-80px)] px-4 py-10">
      {/* Jewelry-themed hero background */}
      <div className="absolute inset-0">
        <img src="/gems-images/jewelry-hero-bg.svg" alt="Jewelry background pattern" className="w-full h-full object-cover" />
      </div>

      <div className="relative max-w-3xl px-6 py-10 md:py-14 bg-transparent">
        <h1 className="text-5xl md:text-7xl font-serif font-extrabold tracking-wide text-white drop-shadow-lg">
          The Art of Bespoke Luxury
        </h1>
        <p className="mt-4 text-sm md:text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
          40 years of heritage meets the future of design. Create your unique masterpiece with our AI-powered customiser.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/customizer">
            <Button size="lg" className="w-full sm:w-auto text-sm md:text-base px-8 py-3 uppercase tracking-wider bg-foreground text-white shadow-md hover:shadow-lg">
              Design Your Ring
            </Button>
          </Link>
          <Link href="/collections">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-sm md:text-base px-8 py-3 uppercase tracking-wider border-white text-white bg-white/5 hover:bg-white/10"
            >
              View Collections
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}