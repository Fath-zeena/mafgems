"use client";

import Link from "next/link";
import { Gem, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="bg-background border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-2">
          <Gem className="h-7 w-7 text-primary" />
          <span className="text-2xl font-serif font-bold tracking-wider text-foreground">MAFGEMS</span>
        </Link>
        <nav className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/collections" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
              Collections
            </Link>
            <Link href="/customizer" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
              Ring Customizer
            </Link>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5 text-gray-600" />
          </Button>
        </nav>
      </div>
    </header>
  );
}