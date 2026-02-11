import { Button } from "@/components/ui/button";
import { Gem, Sparkles, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-2rem)] p-4 text-center">
      <div className="mb-8 p-4 bg-primary/10 rounded-full">
        <Gem className="w-12 h-12 text-primary" />
      </div>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
        Welcome to <span className="text-primary">MAF Gems</span>
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mb-8">
        Discover the finest gemstones and create unique jewelry designs tailored just for you.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Button size="lg" className="gap-2">
          <ShoppingBag className="w-5 h-5" />
          Browse Collection
        </Button>
        <Button size="lg" variant="outline" className="gap-2">
          <Sparkles className="w-5 h-5" />
          Custom Design
        </Button>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        <div className="p-6 border rounded-xl bg-card">
          <h3 className="text-xl font-semibold mb-2">Rare Gems</h3>
          <p className="text-muted-foreground text-sm">Sourced from the most exotic locations around the globe.</p>
        </div>
        <div className="p-6 border rounded-xl bg-card">
          <h3 className="text-xl font-semibold mb-2">Expert Craft</h3>
          <p className="text-muted-foreground text-sm">Master jewelers bringing your vision to life with precision.</p>
        </div>
        <div className="p-6 border rounded-xl bg-card">
          <h3 className="text-xl font-semibold mb-2">Secure Deals</h3>
          <p className="text-muted-foreground text-sm">Every piece comes with a certificate of authenticity and secure shipping.</p>
        </div>
      </div>
    </div>
  );
}