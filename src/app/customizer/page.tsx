"use client";

import { GemGallery } from "@/components/gem-gallery";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomizerProvider, useCustomizer } from "@/context/customizer-context";
import { Button } from "@/components/ui/button";
import { Loader2, Video } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DynamicRingViewer = dynamic(
  () => import("@/components/ring-viewer").then((mod) => mod.RingViewer),
  {
    ssr: false,
    loading: () => <Skeleton className="w-full h-64 md:h-full" />,
  }
);

function CustomizerInner() {
  const { selectedGem, metalColor, setMetalColor, jewelryType, setJewelryType } = useCustomizer();
  const [loading, setLoading] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGeneratePresentation = async () => {
    if (!selectedGem) {
      toast.error("Please select a gem first.");
      return;
    }

    setLoading(true);
    setGeneratedImage(null);
    setVideoId(null);

    try {
      const response = await fetch("/api/generate-jewelry-presentation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gemName: selectedGem.name,
          gemColor: selectedGem.color,
          metalColor: metalColor,
          jewelryType: jewelryType,
          description: `A stunning ${metalColor.replace("_", " ")} ${jewelryType} featuring a beautiful ${selectedGem.name} gemstone.`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate jewelry presentation.");
      }

      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        toast.success(
          `${jewelryType.charAt(0).toUpperCase() + jewelryType.slice(1)} presentation generated successfully!`
        );
      } else {
        throw new Error("No image generated");
      }
    } catch (error) {
      console.error(error);
      const errorMsg =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)] bg-background text-foreground">
      <aside className="w-full md:w-80 lg:w-96 md:h-auto p-4 overflow-y-auto border-b md:border-b-0 md:border-r border-border">
        <h1 className="text-2xl font-bold mb-4">Jewelry Customizer</h1>
        <div className="mb-6">
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Jewelry Type</label>
            <Select value={jewelryType} onValueChange={(value: any) => setJewelryType(value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ring">Ring</SelectItem>
                <SelectItem value="necklace">Necklace</SelectItem>
                <SelectItem value="bracelet">Bracelet</SelectItem>
                <SelectItem value="earrings">Earrings</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Metal Type</label>
            <Select value={metalColor} onValueChange={(value: any) => setMetalColor(value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yellow_gold">Yellow Gold</SelectItem>
                <SelectItem value="white_gold">White Gold</SelectItem>
                <SelectItem value="rose_gold">Rose Gold</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleGeneratePresentation}
            disabled={loading || !selectedGem}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Presentation...
              </>
            ) : (
              <>
                <Video className="mr-2 h-4 w-4" />
                Generate AI Presentation
              </>
            )}
          </Button>
          {generatedImage && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <p className="text-xs font-medium text-green-700 dark:text-green-300 mb-2">
                ✓ Presentation Generated!
              </p>
              <a
                href={generatedImage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 dark:text-blue-400 break-all hover:underline"
              >
                View Full Image
              </a>
            </div>
          )}
        </div>
        <GemGallery />
      </aside>
      <main className="flex-1 h-[320px] md:h-auto md:min-h-[480px]">
        <DynamicRingViewer />
      </main>
    </div>
  );
}

export default function CustomizerPage() {
  return (
    <CustomizerProvider>
      <CustomizerInner />
    </CustomizerProvider>
  );
}