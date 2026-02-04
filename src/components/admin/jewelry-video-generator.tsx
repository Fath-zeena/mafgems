"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Video, Download, Share2, Eye } from "lucide-react";

interface GeneratedVideo {
  id: string;
  gemName: string;
  jewelryType: string;
  videoUrl: string;
  createdAt: string;
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
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>([
    {
      id: "1",
      gemName: "Blue Sapphire",
      jewelryType: "ring",
      videoUrl: "https://example.com/video1.mp4",
      createdAt: "2026-02-04",
      status: "completed",
    },
  ]);

  const handleGenerateVideo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!gemName || !gemColor || !metalColor) {
      toast.error("Please fill in all required fields");
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch("/api/generate-jewelry-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gemName,
          gemColor,
          metalColor,
          jewelryType,
          modelStyle,
          background,
          includeText: true,
          brandName,
          hashtagText,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate video");
      }

      const data = await response.json();

      // Add to generated videos list
      const newVideo: GeneratedVideo = {
        id: Date.now().toString(),
        gemName,
        jewelryType,
        videoUrl: data.videoUrl || "#",
        createdAt: new Date().toISOString().split("T")[0],
        status: data.status as "processing" | "completed",
      };

      setGeneratedVideos((prev) => [newVideo, ...prev]);
      toast.success("Video generation started! This may take 30-60 seconds.");

      // Reset form
      setGemName("");
      setGemColor("");
      setMetalColor("white_gold");

      // Close dialog after short delay
      setTimeout(() => setOpen(false), 1000);
    } catch (error: any) {
      console.error("Video generation error:", error);
      toast.error(error.message || "Failed to generate video");
    } finally {
      setGenerating(false);
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
                  {/* Gem Details */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm">Gemstone Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="gemName">Gemstone Name *</Label>
                        <Input
                          id="gemName"
                          placeholder="e.g., Blue Sapphire"
                          value={gemName}
                          onChange={(e) => setGemName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gemColor">Gem Color *</Label>
                        <Input
                          id="gemColor"
                          placeholder="e.g., Royal Blue"
                          value={gemColor}
                          onChange={(e) => setGemColor(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Metal & Type */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm">Jewelry Settings</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="metalColor">Metal Color *</Label>
                        <Select value={metalColor} onValueChange={setMetalColor}>
                          <SelectTrigger id="metalColor">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="white_gold">White Gold</SelectItem>
                            <SelectItem value="yellow_gold">Yellow Gold</SelectItem>
                            <SelectItem value="rose_gold">Rose Gold</SelectItem>
                            <SelectItem value="platinum">Platinum</SelectItem>
                            <SelectItem value="silver">Silver</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="jewelryType">Jewelry Type *</Label>
                        <Select value={jewelryType} onValueChange={(val: any) => setJewelryType(val)}>
                          <SelectTrigger id="jewelryType">
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
                    </div>
                  </div>

                  {/* Video Style */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm">Video Style</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="modelStyle">Model Style</Label>
                        <Select value={modelStyle} onValueChange={setModelStyle}>
                          <SelectTrigger id="modelStyle">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="luxury">Luxury (Haute Couture)</SelectItem>
                            <SelectItem value="casual">Casual Chic</SelectItem>
                            <SelectItem value="editorial">Editorial Fashion</SelectItem>
                            <SelectItem value="minimalist">Minimalist</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="background">Background</Label>
                        <Select value={background} onValueChange={setBackground}>
                          <SelectTrigger id="background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="studio">Studio (White)</SelectItem>
                            <SelectItem value="lifestyle">Lifestyle</SelectItem>
                            <SelectItem value="gradient">Gradient</SelectItem>
                            <SelectItem value="transparent">Transparent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Branding */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm">Branding & Hashtags</h3>
                    <div className="space-y-2">
                      <Label htmlFor="brandName">Brand Name</Label>
                      <Input
                        id="brandName"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hashtags">Hashtags (for Instagram)</Label>
                      <Input
                        id="hashtags"
                        value={hashtagText}
                        onChange={(e) => setHashtagText(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpen(false)}
                      disabled={generating}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={generating}>
                      {generating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Video className="mr-2 h-4 w-4" />
                          Create Video
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Generated Videos Gallery */}
      <div>
        <h3 className="font-semibold text-lg mb-4">Generated Videos</h3>
        {generatedVideos.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Video className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-500">No videos generated yet</p>
              <p className="text-sm text-gray-400 mt-2">
                Create your first jewelry video to see it here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {generatedVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden">
                <div className="aspect-video bg-gray-900 flex items-center justify-center relative group">
                  <Video className="h-12 w-12 text-gray-600" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary" className="gap-1">
                      <Eye className="h-4 w-4" />
                      Preview
                    </Button>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        video.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {video.status === "completed" ? "Ready" : "Processing"}
                    </span>
                  </div>
                </div>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900">
                      {video.gemName} {video.jewelryType}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">{video.createdAt}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-1"
                      disabled={video.status !== "completed"}
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 gap-1"
                      disabled={video.status !== "completed"}
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
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
