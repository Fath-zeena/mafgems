import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Gem } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Gem className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-4">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-serif font-semibold text-muted-foreground mb-6">
          Page Not Found
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">
              Return Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/collections">
              Browse Collections
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}