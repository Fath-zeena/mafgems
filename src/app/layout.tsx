import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dyad Dashboard",
  description: "High-fidelity professional dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen")}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
              <div className="container flex h-16 items-center px-4 md:px-8">
                <div className="flex items-center gap-2 font-bold text-xl">
                  <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white">D</div>
                  <span>DyadApp</span>
                </div>
                <nav className="ml-auto flex items-center gap-6">
                  <button className="text-sm font-medium text-gray-600 hover:text-blue-600">Documentation</button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Dashboard
                  </button>
                </nav>
              </div>
            </header>
            <main id="main-content" className="flex-1">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}