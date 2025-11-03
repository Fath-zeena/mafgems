"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomizer } from "@/context/customizer-context";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Gem } from "@/types";

export function GemGallery() {
  const { selectedGem, setSelectedGem } = useCustomizer();
  const [gems, setGems] = useState<Gem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchGems = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("gems").select("*");

      if (error) {
        console.error("Error fetching gems:", error);
      } else {
        setGems(data as Gem[]);
      }
      setLoading(false);
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
                <Skeleton className="w-[80px] h-[80px] rounded-md" />
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
        <div className="grid grid-cols-2 gap-4">
          {gems.map((gem) => (
            <div
              key={gem.id}
              className={cn(
                "flex flex-col items-center p-2 border rounded-md cursor-pointer transition-shadow",
                selectedGem?.id === gem.id && "ring-2 ring-primary shadow-lg"
              )}
              draggable
              onClick={() => handleSelectGem(gem)}
              onDragStart={(e) => handleDragStart(e, gem)}
            >
              <Image
                src={gem.image_url}
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
      </CardContent>
    </Card>
  );
}