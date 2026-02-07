"use client";

import { Gem } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-600 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Gem className="h-6 w-6 text-primary" />
              <span className="text-lg font-serif font-semibold">MAFGEMS</span>
            </div>
            <p className="text-sm text-gray-500">Bespoke jewellery crafted with heritage and expertise.</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Shop</h4>
            <ul className="space-y-1 text-sm">
              <li><a className="hover:text-primary" href="/collections">Collections</a></li>
              <li><a className="hover:text-primary" href="/bespoke">Bespoke</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Services</h4>
            <ul className="space-y-1 text-sm">
              <li><a className="hover:text-primary" href="/services">Our Services</a></li>
              <li><a className="hover:text-primary" href="/customizer">Customiser</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Company</h4>
            <ul className="space-y-1 text-sm">
              <li><a className="hover:text-primary" href="/about">About Us</a></li>
              <li><a className="hover:text-primary" href="/contact">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} MAFGEMS. All rights reserved.</p>
          <p className="text-xs text-gray-500 mt-3 md:mt-0">Designed & crafted with heritage.</p>
        </div>
      </div>
    </footer>
  );
}