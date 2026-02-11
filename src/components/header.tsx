"use client";

import { useState } from "react";
import Link from "next/link";
import { Gem, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/collections", label: "Collections" },
  { href: "/presentation", label: "AI Presentation" },
  { href: "/bespoke", label: "Bespoke" },
  { href: "/services", label: "Services" },
  { href: "/customizer", label: "Customiser" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

const footerLinks = {
  shop: [
    { href: "/collections", label: "Collections" },
    { href: "/bespoke", label: "Bespoke" },
  ],
  services: [
    { href: "/services", label: "Our Services" },
    { href: "/customizer", label: "Customiser" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ],
};

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-background border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
            <Gem className="h-7 w-7 text-primary" />
            <span className="text-2xl font-serif font-bold tracking-wider text-foreground">
              MAFGEMS
            </span>
          </Link>

          {/* Right-side icons */}
          <div className="flex items-center gap-2">
            {/* User icon - visible on all screens */}
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <Link href="/auth">
                <User className="h-5 w-5 text-gray-600" />
              </Link>
            </Button>
            
            {/* Hamburger menu button - visible only on mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full md:hidden"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              data-testid="hamburger-menu-btn"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </Button>
          </div>
        </div>

        {/* Desktop Navigation - hidden on mobile */}
        <nav className="hidden md:flex mt-3 flex-wrap gap-4 text-sm font-medium items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${
                link.href === "/customizer" ? "text-gray-900" : "text-gray-700"
              } hover:text-primary transition-colors`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Slide-out Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-background z-50 transform transition-transform duration-300 ease-in-out md:hidden overflow-y-auto ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        data-testid="mobile-menu"
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Gem className="h-6 w-6 text-primary" />
            <span className="text-lg font-serif font-semibold">MAFGEMS</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <X className="h-6 w-6 text-gray-600" />
          </Button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Navigation
          </h3>
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-2 px-3 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Divider */}
        <div className="border-t border-gray-200 mx-4" />

        {/* Footer Content in Mobile Menu */}
        <div className="p-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Shop
          </h3>
          <ul className="space-y-1 mb-4">
            {footerLinks.shop.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-2 px-3 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Services
          </h3>
          <ul className="space-y-1 mb-4">
            {footerLinks.services.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-2 px-3 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Company
          </h3>
          <ul className="space-y-1">
            {footerLinks.company.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-2 px-3 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mx-4" />

        {/* Footer Info */}
        <div className="p-4 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} MAFGEMS. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Bespoke jewellery crafted with heritage and expertise.
          </p>
        </div>
      </div>
    </header>
  );
}
