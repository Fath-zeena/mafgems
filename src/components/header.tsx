"use client";

import Link from "next/link";
import { Gem, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="bg-background border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <Gem className="h-7 w-7 text-primary" />
          <span className="text-2xl font-serif font-bold tracking-wider text-foreground">
            MAFGEMS
          </span>
        </Link>

        {/* Primary Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link
            href="/collections"
            className="text-gray-700 hover:text-primary transition-colors"
          >
            Collections
          </Link>
          <Link
            href="/bespoke"
            className="text-gray-700 hover:text-primary transition-colors"
          >
            Bespoke
          </Link>
          <Link
            href="/about"
            className="text-gray-700 hover:text-primary transition-colors"
          >
            About
          </Link>
          <Link
            href="/services"
            className="text-gray-700 hover:text-primary transition-colors"
          >
            Services
          </Link>
          <Link
            href="/contact"
            className="text-gray-700 hover:text-primary transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/customizer"
            className="text-gray-900 hover:text-primary transition-colors"
          >
            Ring Customizer
          </Link>
        </nav>

        {/* Right-side icons (placeholder for account) */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
      </div>
    </header>
  );
}