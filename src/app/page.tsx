"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full py-20 px-4">
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
          Exquisite Craftsmanship, Timeless Design
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground">
          Discover the art of fine jewelry. Each piece is a testament to our dedication to quality and elegance. Create your own unique masterpiece with our interactive customizer.
        </p>
        <div className="mt-10">
          <Link href="/customizer">
            <Button size="lg" className="text-lg px-8 py-6">
              Create Your Own
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}