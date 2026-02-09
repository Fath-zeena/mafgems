"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomizer } from "@/context/customizer-context";
import { GemViewer } from "@/components/gem-viewer";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Gem } from "@/types";

const MOCK_GEMS: Gem[] = [
  { id: 1, name: "Diamond", color: "#F0F0F0", image_url: "https://placehold.co/80/f0f0f0/000000?text=Diamond" },
  { id: 2, name: "Ruby", color: "#E0115F", image_url: "https://placehold.co/80/e0115f/ffffff?text=Ruby" },
  { id: 3, name: "Emerald", color: "#50C878", image_url: "https://placehold.co/80/50c878/ffffff?text=Emerald" },
  { id: 4, name: "Sapphire", color: "#0F52BA", image_url: "https://placehold.co/80/0f52ba/ffffff?text=Sapphire" },
  { id: 5, name: "Amethyst", color: "#9966CC", image_url: "https://placehold.co/80/9966cc/ffffff?text=Amethyst" },
  { id: 6, name: "Topaz", color: "#FFC87C", image_url: "https://placehold.co/80/ffc87c/000000?text=Topaz" },
  { id: 7, name: "Pearl", color: "#F0F0F0", image_url: "https://placehold.co/80/f0f0f0/999999?text=Pearl" },
  { id: 8, name: "Opal", color: "#A9A9A9", image_url: "https://placehold.co/80/a9a9a9/ffffff?text=Opal" },
  { id: 9, name: "Alexandrite", color: "#6A0DAD", image_url: "https://placehold.co/80/6a0dad/ffffff?text=Alexandrite" },
  { id: 10, name: "Aquamarine", color: "#7FFFD4", image_url: "https://placehold.co/80/7fffd4/000000?text=Aquamarine" },
  { id: 11, name: "Garnet", color: "#922B3E", image_url: "https://placehold.co/80/922b3e/ffffff?text=Garnet" },
  { id: 12, name: "Citrine", color: "#E06377", image_url: "https://placehold.co/80/e06377/ffffff?text=Citrine" },
  { id: 13, name: "Morganite", color: "#FF99CC", image_url: "https://placehold.co/80/ff99cc/ffffff?text=Morganite" },
  { id: 14, name: "Tanzanite", color: "#0047AB", image_url: "https://placehold.co/80/0047ab/ffffff?text=Tanzanite" },
  { id: 15, name: "Peridot", color: "#E8FF00", image_url: "https://placehold.co/80/e8ff00/000000?text=Peridot" },
];

export function GemGallery() {
  const { selectedGem, setSelectedGem } = useCustomizer();
  const [gems, setGems] = useState<Gem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGems = async () => {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data, error } = await supabase.from("gems").select("*");

        if (error) {
          console.error("Error fetching gems from Supabase:", error);
          console.log("Using mock data as fallback");
          setGems(MOCK_GEMS);
        } else if (data && Array.isArray(data) && data.length > 0) {
          console.log(`Loaded ${data.length} gems from Supabase`, data);
          setGems(data as Gem[]);
        } else {
          console.warn("No gems data received from Supabase, using mock data");
          setGems(MOCK_GEMS);
        }
      } catch (err) {
        console.error("Exception while fetching gems:", err);
        console.log("Using mock data as fallback due to exception");
        setGems(MOCK_GEMS);
      } finally {
        setLoading(false);
      }
    };

    fetchGems();
  }, []);

  const handleSelectGem = (gem: Gem) => {
    setSelectedGem(gem);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, gem: Gem) => {
    e.dataTransfer.setData("application/json", JSON.stringify(gem));
    handleSelectGem(gem);
  };

  const handleRemoveGem = () => {
    setSelectedGem(null);
  };

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerGem, setViewerGem] = useState<Gem | null>(null);

  const openViewer = (gem: Gem) => {
    setViewerGem(gem);
    setViewerOpen(true);
    setSelectedGem(gem);
  };

  const closeViewer = () => {
    setViewerOpen(false);
    setViewerGem(null);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gems & Diamonds</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center p-2">
                <Skeleton className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] rounded-md" />
                <Skeleton className="h-4 w-16 mt-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gems & Diamonds</CardTitle>
      </CardHeader>
      <CardContent>
        {gems.length === 0 && !loading && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No gems loaded. Check the browser console for errors.</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          {gems.map((gem) => (
            <div
              key={gem.id}
              className={cn(
                "flex flex-col items-center p-2 border rounded-md cursor-pointer transition-shadow",
                selectedGem?.id === gem.id && "ring-2 ring-primary shadow-lg"
              )}
              draggable
              onClick={() => openViewer(gem)}
              onDragStart={(e) => handleDragStart(e, gem)}
            >
              <Image
                src={gem.image_url || "/placeholder-gem.svg"}
                alt={gem.name}
                width={80}
                height={80}
                className="rounded-md"
              />
              <p className="mt-2 text-sm font-medium text-center">{gem.name}</p>
            </div>
          ))}
        </div>
        {selectedGem && (
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={handleRemoveGem}
          >
            Remove Gem
          </Button>
        )}
        {viewerGem && (
          <GemViewer gem={viewerGem} open={viewerOpen} onClose={closeViewer} />
        )}
      </CardContent>
    </Card>
  );
}