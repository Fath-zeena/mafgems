"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Video, Download, Share2, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GenerateVideoFormProps {
  collectionTitle?: string;
  onSuccess?: (videoUrl: string, videoData: any) => void;
  setOpen?: (open: boolean) => void;
}

export function GenerateVideoForm({ collectionTitle, onSuccess, setOpen }: GenerateVideoFormProps) {
  const [gemName, setGemName] = useState("");
  const [gemColor, setGemColor] = useState("blue");
  const [metalColor, setMetalColor] = useState("white_gold");
  const [jewelryType, setJewelryType] = useState<"ring" | "necklace" | "bracelet" | "earrings">("ring");
  const [modelPreference, setModelPreference] = useState("diverse");
  const [videoStyle, setVideoStyle] = useState("showcase");
  const [customDescription, setCustomDescription] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<any>(null);

  const gemOptions = [
    "Diamond",
    "Ruby",
    "Emerald",
    "Sapphire",
    "Topaz",
    "Amethyst",
    "Pearl",
    "Opal",
  ];

  const gemColors: { [key: string]: string } = {
    white: "White",
    blue: "Blue",
    red: "Red",
    green: "Green",
    yellow: "Yellow",
    purple: "Purple",
    pink: "Pink",
    gold: "Gold",
  };

  const metalColors: { [key: string]: string } = {
    white_gold: "White Gold",
    yellow_gold: "Yellow Gold",
    rose_gold: "Rose Gold",
    platinum: "Platinum",
    silver: "Silver",
  };

  const videoStyles = {
    showcase: "Showcase (Clean background)",
    detailed: "Detailed (Close-up focus)",
    lifestyle: "Lifestyle (Wearing scenario)",
  };

  const modelPreferences = {
    female: "Female Model",
    male: "Male Model",
    diverse: "Diverse Models Mix",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!gemName) {
      toast.error("Please select a gemstone.");
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch("/api/generate-jewelry-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collectionTitle: collectionTitle || "Custom Collection",
          gemName,
          gemColor: gemColor as string,
          metalColor,
          jewelryType,
          modelPreference,
          videoStyle,
          description: customDescription || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate jewelry video.");
      }

      if (data.videoUrl) {
        setGeneratedVideo(data);
        toast.success(
          `Video generated successfully! Ready to share on Instagram.`
        );
        if (onSuccess) {
          onSuccess(data.videoUrl, data);
        }
      } else {
        throw new Error("No video generated");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to generate jewelry video");
    } finally {
      setGenerating(false);
    }
  };

  if (generatedVideo) {
    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Check className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-green-900">Video Generated Successfully!</h3>
          </div>

          {/* Video Preview */}
          <div className="bg-black rounded-lg overflow-hidden mb-4 aspect-video flex items-center justify-center">
            <video
              className="w-full h-full object-cover"
              controls
              autoPlay
              loop
              src={generatedVideo.videoUrl}
            >
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Video Details */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-sm">
              <p className="text-gray-600">Duration</p>
              <p className="font-semibold">{generatedVideo.duration}</p>
            </div>
            <div className="text-sm">
              <p className="text-gray-600">Style</p>
              <Badge variant="secondary">{videoStyle}</Badge>
            </div>
            <div className="text-sm col-span-2">
              <p className="text-gray-600 mb-2">Video URL</p>
              <a
                href={generatedVideo.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 break-all hover:underline"
              >
                {generatedVideo.videoUrl}
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(generatedVideo.videoUrl);
                toast.success("Video URL copied to clipboard!");
              }}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const a = document.createElement("a");
                a.href = generatedVideo.videoUrl;
                a.download = `${gemName}-${jewelryType}-video.mp4`;
                a.click();
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              size="sm"
              onClick={() => {
                window.open(
                  `https://instagram.com/?url=${encodeURIComponent(generatedVideo.videoUrl)}`,
                  "_blank"
                );
              }}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share on Instagram
            </Button>
          </div>

          <Button
            size="sm"
            variant="ghost"
            className="w-full mt-4"
            onClick={() => {
              setGeneratedVideo(null);
              setGemName("");
              setCustomDescription("");
            }}
          >
            Generate Another Video
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Jewelry Type */}
        <div className="space-y-2">
          <Label htmlFor="jewelry-type" className="text-sm font-medium">
            Jewelry Type *
          </Label>
          <Select value={jewelryType} onValueChange={(v: any) => setJewelryType(v)}>
            <SelectTrigger id="jewelry-type">
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

        {/* Gemstone */}
        <div className="space-y-2">
          <Label htmlFor="gem-name" className="text-sm font-medium">
            Gemstone *
          </Label>
          <Select value={gemName} onValueChange={setGemName}>
            <SelectTrigger id="gem-name">
              <SelectValue placeholder="Select a gemstone" />
            </SelectTrigger>
            <SelectContent>
              {gemOptions.map((gem) => (
                <SelectItem key={gem} value={gem}>
                  {gem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Gem Color */}
          <div className="space-y-2">
            <Label htmlFor="gem-color" className="text-sm font-medium">
              Gem Color
            </Label>
            <Select value={gemColor} onValueChange={setGemColor}>
              <SelectTrigger id="gem-color">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(gemColors).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Metal Color */}
          <div className="space-y-2">
            <Label htmlFor="metal-color" className="text-sm font-medium">
              Metal
            </Label>
            <Select value={metalColor} onValueChange={setMetalColor}>
              <SelectTrigger id="metal-color">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(metalColors).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Video Style */}
        <div className="space-y-2">
          <Label htmlFor="video-style" className="text-sm font-medium">
            Video Style
          </Label>
          <Select value={videoStyle} onValueChange={setVideoStyle}>
            <SelectTrigger id="video-style">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(videoStyles).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Model Preference */}
        <div className="space-y-2">
          <Label htmlFor="model-preference" className="text-sm font-medium">
            Model Preference
          </Label>
          <Select value={modelPreference} onValueChange={setModelPreference}>
            <SelectTrigger id="model-preference">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(modelPreferences).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Custom Description (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="custom-description" className="text-sm font-medium">
            Custom Description (Optional)
          </Label>
          <Textarea
            id="custom-description"
            placeholder="Add any special instructions for the video generation..."
            value={customDescription}
            onChange={(e) => setCustomDescription(e.target.value)}
            rows={3}
          />
        </div>

        <Button type="submit" disabled={generating} className="w-full bg-blue-600 hover:bg-blue-700">
          {generating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Video with AI Model...
            </>
          ) : (
            <>
              <Video className="mr-2 h-4 w-4" />
              Generate Instagram Video
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

// Icon import fallback
function Copy(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
    </svg>
  );
}
