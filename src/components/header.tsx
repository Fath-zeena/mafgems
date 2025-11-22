"use client";

import Link from "next/link";
import { Gem } from "lucide-react";

export function Header() {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <Gem className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold text-foreground">MAFGEMS</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/collections" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Collections
          </Link>
          <Link href="/customizer" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Ring Customizer
          </Link>
          <Link href="/bracelet-customizer" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Bracelet Customizer
          </Link>
        </nav>
      </div>
    </header>
  );
}