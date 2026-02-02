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
  const { selectedGem, metalColor, setMetalColor } = useCustomizer();
  const [loading, setLoading] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);

  const handleGeneratePresentation = async () => {
    if (!selectedGem) {
      toast.error("Please select a gem first.");
      return;
    }

    setLoading(true);
    setVideoId(null);

    try {
      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gemName: selectedGem.name,
          gemImageUrl: selectedGem.image_url,
          metalColor: "Yellow Gold",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to start video generation.");
      }

      setVideoId(data.videoId || null);
      toast.success("Video generation started in HeyGen.");
    } catch (error) {
      console.error(error);
      toast.error("Error generating AI presentation. Check API keys.");
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
                Generating AI Presentation...
              </>
            ) : (
              <>
                <Video className="mr-2 h-4 w-4" />
                Create AI Presentation
              </>
            )}
          </Button>
          {videoId && (
            <p className="mt-2 text-xs text-green-700 break-all">
              Video ID: {videoId} (check HeyGen dashboard)
            </p>
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