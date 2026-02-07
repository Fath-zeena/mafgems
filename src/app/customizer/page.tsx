"use client";

import { GemGallery } from "@/components/gem-gallery";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomizerProvider, useCustomizer } from "@/context/customizer-context";
import { Button } from "@/components/ui/button";
import { Loader2, Video, LogIn, Settings2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Client-only 3D Viewer
const DynamicRingViewer = dynamic(
  () => import("@/components/ring-viewer").then((mod) => mod.RingViewer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <Skeleton className="w-full h-full" />
      </div>
    ),
  }
);

function CustomizerInner() {
  const { selectedGem, metalColor, setMetalColor, jewelryType, setJewelryType } = useCustomizer();
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    checkUser();
  }, [supabase.auth]);

  const handleAction = async () => {
    // Redirect to login if not authenticated
    if (!userId) {
      toast.info("Please sign in to save and generate your designs.");
      router.push("/auth");
      return;
    }

    if (!selectedGem) {
      toast.error("Please select a gemstone first.");
      return;
    }

    setLoading(true);
    setGeneratedImage(null);

    try {
      const response = await fetch("/api/generate-jewelry-presentation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gemName: selectedGem.name,
          gemColor: selectedGem.color,
          metalColor: metalColor,
          jewelryType: jewelryType,
          userId: userId,
          description: `A professional luxury showcase of a ${metalColor.replace("_", " ")} ${jewelryType} with a ${selectedGem.name}.`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Generation failed.");
      }

      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        toast.success("AI Presentation generated! View it in your dashboard.");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden bg-background">
      {/* Sidebar Controls */}
      <aside className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r flex flex-col bg-white z-10">
        <div className="p-6 border-b space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <Settings2 className="h-5 w-5" />
            <h1 className="text-xl font-serif font-bold">Customizer</h1>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Jewelry Type
              </label>
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

            <Button
              onClick={handleAction}
              disabled={loading || (userId && !selectedGem)}
              className={`w-full h-11 ${!userId ? 'bg-primary' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : !userId ? (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In to Generate
                </>
              ) : (
                <>
                  <Video className="mr-2 h-4 w-4" />
                  Generate AI Presentation
                </>
              )}
            </Button>

            {!userId && (
              <p className="text-[10px] text-center text-muted-foreground italic">
                Authentication required for AI generation and cloud saving.
              </p>
            )}

            {generatedImage && (
              <div className="mt-2 p-3 bg-green-50 border border-green-100 rounded-lg text-center">
                <p className="text-xs font-medium text-green-700">Design Saved!</p>
                <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => router.push('/dashboard')}>
                  View in Dashboard
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <GemGallery />
        </div>
      </aside>

      {/* Main Preview Area */}
      <main className="flex-1 relative flex flex-col bg-gray-50">
        {/* Top bar for mobile/desktop metal selection */}
        <div className="p-4 bg-white/80 backdrop-blur-md border-b flex items-center justify-between">
          <div className="flex items-center gap-4 w-full max-w-xs">
            <label className="text-xs font-semibold uppercase text-gray-500 whitespace-nowrap">
              Metal Type
            </label>
            <Select value={metalColor} onValueChange={(value: any) => setMetalColor(value)}>
              <SelectTrigger className="w-full h-9">
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
        </div>

        {/* 3D Viewer Container */}
        <div className="flex-1 relative w-full h-full min-h-[400px]">
          <DynamicRingViewer />
        </div>
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