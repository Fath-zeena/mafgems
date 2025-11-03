"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCustomizer } from "@/context/customizer-context";
import { cn } from "@/lib/utils";
import type { Gem } from "@/types";

// Hardcoded gem data for reliable display
const initialGems: Gem[] = [
  { id: 1, name: 'Diamond', image_url: 'https://placehold.co/100x100/EBF4FA/333', color: '#EBF4FA' },
  { id: 2, name: 'Ruby', image_url: 'https://placehold.co/100x100/F5B7B1/333', color: '#E74C3C' },
  { id: 3, name: 'Sapphire', image_url: 'https://placehold.co/100x100/A9CCE3/333', color: '#3498DB' },
  { id: 4, name: 'Emerald', image_url: 'https://placehold.co/100x100/A9DFBF/333', color: '#2ECC71' },
  { id: 5, name: 'Amethyst', image_url: 'https://placehold.co/100x100/D2B4DE/333', color: '#8E44AD' },
  { id: 6, name: 'Topaz', image_url: 'https://placehold.co/100x100/FAD7A0/333', color: '#F39C12' },
  { id: 7, name: 'Peridot', image_url: 'https://placehold.co/100x100/ABEBC6/333', color: '#82E0AA' },
  { id: 8, name: 'Aquamarine', image_url: 'https://placehold.co/100x100/A2D9CE/333', color: '#76D7C4' },
];

export function GemGallery() {
  const { selectedGem, setSelectedGem } = useCustomizer();
  // Use hardcoded gems directly
  const gems = initialGems;

  const handleSelectGem = (gem: Gem) => {
    setSelectedGem({
      id: gem.id,
      name: gem.name,
      imageUrl: gem.image_url,
      color: gem.color,
    });
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, gem: Gem) => {
    // Store the gem data as a JSON string in the dataTransfer object
    e.dataTransfer.setData("application/json", JSON.stringify({
      id: gem.id,
      name: gem.name,
      imageUrl: gem.image_url,
      color: gem.color,
    }));
    // Immediately update the gem on the ring when dragging starts
    handleSelectGem(gem);
  };

  const handleRemoveGem = () => {
    setSelectedGem(null);
  };

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
              <Image src={gem.image_url} alt={gem.name} width={80} height={80} className="rounded-md" />
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