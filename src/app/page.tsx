"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="relative flex flex-col items-center justify-center text-center h-[calc(100vh-80px)] bg-gray-100">
      {/* Placeholder for a stunning hero image or video */}
      <div className="absolute inset-0 bg-cover bg-center opacity-70" style={{ backgroundImage: "url('https://placehold.co/1920x1080/EBF4FA/333?text=Exquisite+Jewelry')" }}></div>
      
      <div className="relative max-w-4xl p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-2xl">
        <h1 className="text-5xl md:text-7xl font-serif font-extrabold tracking-tight text-gray-900">
          The Art of Bespoke Luxury
        </h1>
        <p className="mt-6 text-xl md:text-2xl text-gray-700 font-light">
          40 years of heritage meets the future of design. Create your unique masterpiece with our AI-powered customizer.
        </p>
        <div className="mt-10 flex justify-center space-x-4">
          <Link href="/customizer">
            <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 transition-colors shadow-md">
              Design Your Ring
            </Button>
          </Link>
          <Link href="/collections">
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-gray-400 text-gray-800 hover:bg-gray-200 transition-colors shadow-md">
              View Collections
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}