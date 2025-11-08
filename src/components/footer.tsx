"use client";

import { Gem } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Gem className="h-6 w-6" />
            <span className="text-xl font-semibold">MAFGEMS</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MAFGEMS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}