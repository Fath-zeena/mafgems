import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Modern SaaS Application",
  description: "A high-fidelity application built with Next.js and Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={cn(inter.className, "min-h-screen flex flex-col")}>
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
                D
              </div>
              <span className="text-xl font-bold tracking-tight">DyadApp</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <a href="#" className="transition-colors hover:text-primary">Dashboard</a>
              <a href="#" className="transition-colors hover:text-primary">Analytics</a>
              <a href="#" className="transition-colors hover:text-primary">Settings</a>
            </nav>
            <div className="flex items-center gap-4">
              <button className="text-sm font-medium hover:underline underline-offset-4">Log in</button>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-transform active:scale-95">
                Get Started
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
        <footer className="border-t py-6 md:py-0">
          <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Dyad. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}