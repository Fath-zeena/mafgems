"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingBag, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Collections', href: '/collections' },
    { name: 'Gemstones', href: '/gemstones' },
    { name: 'Custom Design', href: '/custom' },
    { name: 'About', href: '/about' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tighter text-primary">MAF GEMS</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-primary/80"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden absolute top-16 left-0 w-full bg-background border-b transition-all duration-300 ease-in-out",
          isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        )}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-lg font-medium py-2 border-b border-muted last:border-0"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;