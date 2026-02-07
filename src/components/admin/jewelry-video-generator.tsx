"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Video, Download, Share2, Eye, Trash2 } from "lucide-react";

interface GeneratedVideo {
  id: string;
  gem_name: string;
  jewelry_type: string;
  video_url: string;
  created_at: string;
  status: "processing" | "completed" | "failed";
}

export function JewelryVideoGenerator() {
  const [open, setOpen] = useState(false);
  const [gemName, setGemName] = useState("");
  const [gemColor, setGemColor] = useState("");
  const [metalColor, setMetalColor] = useState("white_gold");
  const [jewelryType, setJewelryType] = useState<"ring" | "necklace" | "bracelet" | "earrings">("ring");
  const [modelStyle, setModelStyle] = useState("luxury");
  const [background, setBackground] = useState("studio");
  const [brandName, setBrandName] = useState("MAFGEMS");
  const [hashtagText, setHashtagText] = useState("#CustomJewelry #MafgemsDesigns");
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>([]);
  
  const supabase = createClient();

  const fetchVideos = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const response = await fetch(`/api/generate-jewelry-video?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setGeneratedVideos(data);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleGenerateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Please log in to generate videos");
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch("/api/generate-jewelry-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gemName, gemColor, metalColor, jewelryType,
          modelStyle, background, includeText: true,
          brandName, hashtagText, userId: user.id
        }),
      });

      if (!response.ok) throw new Error("Failed to generate video");

      toast.success("Video generation started! Refreshing gallery...");
      fetchVideos();
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to generate video");
    } finally {
      setGenerating(false);
    }
  };

  const deleteVideo = async (id: string) => {
    try {
      const { error } = await supabase.from("jewelry_videos").delete().eq("id", id);
      if (error) throw error;
      setGeneratedVideos(prev => prev.filter(v => v.id !== id));
      toast.success("Video record deleted");
    } catch (error) {
      toast.error("Failed to delete video record");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Video className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Jewelry Video Generator</CardTitle>
                <CardDescription>
                  Create Instagram-ready videos with AI models showcasing your designs
                </CardDescription>
              </div>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Video className="h-4 w-4" />
                  Create Video
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Generate Jewelry Video</DialogTitle>
                  <DialogDescription>
                    Create a 15-second video with AI model showcasing your jewelry design
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleGenerateVideo} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gemName">Gemstone Name</Label>
                      <Input id="gemName" value={gemName} onChange={(e) => setGemName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gemColor">Gem Color</Label>
                      <Input id="gemColor" value={gemColor} onChange={(e) => setGemColor(e.target.value)} required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="metalColor">Metal Color</Label>
                      <Select value={metalColor} onValueChange={setMetalColor}>
                        <SelectTrigger id="metalColor"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="white_gold">White Gold</SelectItem>
                          <SelectItem value="yellow_gold">Yellow Gold</SelectItem>
                          <SelectItem value="rose_gold">Rose Gold</SelectItem>
                          <SelectItem value="platinum">Platinum</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jewelryType">Jewelry Type</Label>
                      <Select value={jewelryType} onValueChange={(val: any) => setJewelryType(val)}>
                        <SelectTrigger id="jewelryType"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ring">Ring</SelectItem>
                          <SelectItem value="necklace">Necklace</SelectItem>
                          <SelectItem value="earrings">Earrings</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={generating}>
                    {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Video className="mr-2 h-4 w-4" />}
                    {generating ? "Generating..." : "Create Video"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      <div>
        <h3 className="font-semibold text-lg mb-4">Saved Videos</h3>
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
        ) : generatedVideos.length === 0 ? (
          <p className="text-center py-12 text-gray-500 border-2 border-dashed rounded-lg">No videos generated yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {generatedVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden group">
                <div className="aspect-video bg-gray-900 flex items-center justify-center relative">
                  <Video className="h-10 w-10 text-gray-700" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => window.open(video.video_url)}><Eye className="h-4 w-4 mr-1" /> View</Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteVideo(video.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-sm capitalize">{video.gem_name} {video.jewelry_type}</h4>
                      <p className="text-xs text-gray-500">{new Date(video.created_at).toLocaleDateString()}</p>
                    </div>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => window.open(video.video_url)}><Download className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}