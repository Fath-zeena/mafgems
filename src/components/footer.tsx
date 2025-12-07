"use client";

import { Gem } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-600 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-2 md:mb-0">
            <Gem className="h-5 w-5 text-primary" />
            <span className="text-lg font-serif font-semibold">MAFGEMS</span>
          </div>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} MAFGEMS. All rights reserved. | Crafted with Heritage.
          </p>
        </div>
      </div>
    </footer>
  );
}