"use client";

import { GemGallery } from "@/components/gem-gallery";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomizerProvider, useCustomizer } from "@/context/customizer-context";
import { Button } from "@/components/ui/button";
import { Loader2, Video } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const DynamicRingViewer = dynamic(
  () => import("@/components/ring-viewer").then((mod) => mod.RingViewer),
  {
    ssr: false,
    loading: () => <Skeleton className="w-full h-full" />,
  }
);

function CustomizerContent() {
  const { selectedGem } = useCustomizer();
  const [loading, setLoading] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);

  const handleGeneratePresentation = async () => {
    if (!selectedGem) {
      toast.error("Please select a gem first.");
      return;
    }

    // 1. Capture the 3D image from the canvas
    const captureImage = (window as any).captureRingImage;
    if (!captureImage) {
      toast.error("3D viewer not ready for capture.");
      return;
    }
    
    const imageUrl = captureImage(); // Base64 image data

    setLoading(true);
    setVideoId(null);

    try {
      // 2. Send data to our serverless API
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gemName: selectedGem.name,
          metalColor: "Yellow Gold", // Assuming default metal color for now
          imageUrl: imageUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to start video generation.");
      }

      setVideoId(data.videoId);
      toast.success("Video generation started! Check back in a moment.");

    } catch (error) {
      console.error(error);
      toast.error("Error generating presentation. Check API keys.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-background text-foreground">
      <aside className="w-full md:w-80 lg:w-96 md:h-full p-4 overflow-y-auto border-b md:border-b-0 md:border-r border-border">
        <h1 className="text-2xl font-bold mb-4">Jewelry Customizer</h1>
        <div className="mb-6">
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
                Create Virtual Presentation
              </>
            )}
          </Button>
          {videoId && (
            <p className="mt-2 text-sm text-green-600">Video ID: {videoId} (Check HeyGen dashboard)</p>
          )}
        </div>
        <GemGallery />
      </aside>
      <main className="flex-1 h-full mt-[-5px] md:mt-0">
        <DynamicRingViewer />
      </main>
    </div>
  );
}

export default function CustomizerPage() {
  return (
    <CustomizerProvider>
      <CustomizerContent />
    </CustomizerProvider>
  );
}