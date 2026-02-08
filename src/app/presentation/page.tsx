"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image as ImageIcon, Video, Box, Loader2, Download, Share2 } from "lucide-react";
import { toast } from "sonner";

export default function PresentationPage() {
  // Input method selection
  const [inputMethod, setInputMethod] = useState<"text-to-image" | "text-to-video" | "image-to-video" | "image-to-3d" | "text-to-3d">("text-to-image");

  // Form fields
  const [textPrompt, setTextPrompt] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Workflow configuration
  const [jewelryType, setJewelryType] = useState("ring");
  const [modelProfile, setModelProfile] = useState("frontal");
  const [background, setBackground] = useState("studio");
  const [outfitConfig, outfitConfigSet] = useState("single-item");
  const [outputFormat, setOutputFormat] = useState("render");

  // Style options
  const [styleReference, setStyleReference] = useState("photorealistic");
  const [colorPalette, setColorPalette] = useState("vibrant");
  const [resolution, setResolution] = useState("1024");
  const [detailLevel, setDetailLevel] = useState([7]);
  const [lightingStyle, setLightingStyle] = useState("studio");

  // Video settings
  const [videoDuration, setVideoDuration] = useState("30");
  const [frameRate, setFrameRate] = useState("30");
  const [videoStyle, setVideoStyle] = useState("rotate");

  // Advanced options
  const [modelBodyType, setModelBodyType] = useState("medium");
  const [skinTone, setSkinTone] = useState("medium");
  const [iterationMode, setIterationMode] = useState("single");

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{ url: string; type: string } | null>(null);

  const inputMethods = [
    { id: "text-to-image", label: "Text to Image", icon: ImageIcon },
    { id: "text-to-video", label: "Text to Video", icon: Video },
    { id: "image-to-video", label: "Image to Video", icon: Video },
    { id: "image-to-3d", label: "Image to 3D", icon: Box },
    { id: "text-to-3d", label: "Text to 3D", icon: Box },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGeneratePresentation = async () => {
    if (!textPrompt && !uploadedImage) {
      toast.error("Please enter a description or upload an image");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call - replace with actual API integration
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      setGeneratedContent({
        url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1024&q=80",
        type: inputMethod,
      });
      toast.success("Presentation generated successfully!");
    } catch (error) {
      toast.error("Failed to generate presentation");
    } finally {
      setIsLoading(false);
    }
  };

  const showImageFields = ["text-to-image", "text-to-video", "text-to-3d"].includes(inputMethod);
  const showUploadFields = ["image-to-video", "image-to-3d"].includes(inputMethod);
  const showVideoSettings = ["text-to-video", "image-to-video"].includes(inputMethod);
  const show3DSettings = ["image-to-3d", "text-to-3d"].includes(inputMethod);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
            Generate AI Jewellery Presentations
          </h1>
          <p className="text-lg text-slate-600">
            Create stunning, professional presentations from text or images. Choose your workflow and customize every detail.
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Input Method Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Input Method</CardTitle>
                <CardDescription>Choose how you want to create your presentation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {inputMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setInputMethod(method.id as any)}
                        className={`p-4 rounded-lg border-2 text-center transition-all ${
                          inputMethod === method.id
                            ? "border-blue-600 bg-blue-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <Icon className="h-6 w-6 mx-auto mb-2 text-slate-600" />
                        <p className="text-xs font-semibold text-slate-900">{method.label}</p>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle>Create Your Design</CardTitle>
                <CardDescription>Describe your jewellery or upload a reference image</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {showImageFields && (
                  <div className="space-y-2">
                    <Label htmlFor="prompt">Design Description</Label>
                    <textarea
                      id="prompt"
                      placeholder="E.g., 'A diamond ring with intricate gold band, elegant and timeless design, professional studio lighting'"
                      value={textPrompt}
                      onChange={(e) => setTextPrompt(e.target.value)}
                      className="w-full h-32 p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {showUploadFields && (
                  <div className="space-y-2">
                    <Label htmlFor="image-upload">Upload Reference Image</Label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                    >
                      {uploadedImage ? (
                        <div className="space-y-2">
                          <img src={uploadedImage} alt="Uploaded" className="h-32 mx-auto object-cover rounded" />
                          <p className="text-sm text-slate-600">Click to change image</p>
                        </div>
                      ) : (
                        <div>
                          <ImageIcon className="h-12 w-12 mx-auto text-slate-400 mb-2" />
                          <p className="text-sm text-slate-600">Click to upload or drag and drop</p>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                )}

                {showImageFields && (
                  <div className="space-y-2">
                    <Label htmlFor="secondary-upload">Optional: Reference Image</Label>
                    <Input
                      id="secondary-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="cursor-pointer"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Workflow Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Workflow Configuration</CardTitle>
                <CardDescription>Customize how your presentation will be created</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="jewelry-type">Jewellery Type</Label>
                  <Select value={jewelryType} onValueChange={setJewelryType}>
                    <SelectTrigger id="jewelry-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ring">Ring</SelectItem>
                      <SelectItem value="necklace">Necklace</SelectItem>
                      <SelectItem value="bracelet">Bracelet</SelectItem>
                      <SelectItem value="earrings">Earrings</SelectItem>
                      <SelectItem value="brooch">Brooch</SelectItem>
                      <SelectItem value="pendant">Pendant</SelectItem>
                      <SelectItem value="choker">Choker</SelectItem>
                      <SelectItem value="anklet">Anklet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model-profile">Model Profile</Label>
                  <Select value={modelProfile} onValueChange={setModelProfile}>
                    <SelectTrigger id="model-profile">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frontal">Frontal View</SelectItem>
                      <SelectItem value="side">Side View</SelectItem>
                      <SelectItem value="back">Back View</SelectItem>
                      <SelectItem value="full-body">Full Body</SelectItem>
                      <SelectItem value="detail">Detail Close-up</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="background">Background Style</Label>
                  <Select value={background} onValueChange={setBackground}>
                    <SelectTrigger id="background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="white">White Studio</SelectItem>
                      <SelectItem value="studio">Studio Gradient</SelectItem>
                      <SelectItem value="outdoor">Outdoor</SelectItem>
                      <SelectItem value="minimalist">Minimalist</SelectItem>
                      <SelectItem value="custom">Custom Color</SelectItem>
                      <SelectItem value="transparent">Transparent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="output-format">Output Format</Label>
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger id="output-format">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="render">Photorealistic Render</SelectItem>
                      <SelectItem value="sketch">Design Sketch</SelectItem>
                      <SelectItem value="flat-sketch">Flat Sketch</SelectItem>
                      <SelectItem value="3d-render">3D Render</SelectItem>
                      <SelectItem value="technical">Technical Drawing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="outfit-config">Outfit Configuration</Label>
                  <Select value={outfitConfig} onValueChange={outfitConfigSet}>
                    <SelectTrigger id="outfit-config">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single-item">Single Item Only</SelectItem>
                      <SelectItem value="complete-outfit">Complete Outfit</SelectItem>
                      <SelectItem value="styling-set">Styling Set</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color-palette">Color Palette</Label>
                  <Select value={colorPalette} onValueChange={setColorPalette}>
                    <SelectTrigger id="color-palette">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vibrant">Vibrant</SelectItem>
                      <SelectItem value="pastel">Pastel</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="monochrome">Monochrome</SelectItem>
                      <SelectItem value="gold-accent">Gold Accent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Style Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Style & Quality</CardTitle>
                <CardDescription>Fine-tune the appearance and quality</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="style-ref">Style Reference</Label>
                    <Select value={styleReference} onValueChange={setStyleReference}>
                      <SelectTrigger id="style-ref">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="photorealistic">Photorealistic</SelectItem>
                        <SelectItem value="illustration">Illustration</SelectItem>
                        <SelectItem value="sketch">Sketch</SelectItem>
                        <SelectItem value="digital-art">Digital Art</SelectItem>
                        <SelectItem value="fashion-render">Fashion Render</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resolution">Resolution</Label>
                    <Select value={resolution} onValueChange={setResolution}>
                      <SelectTrigger id="resolution">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="512">512x512</SelectItem>
                        <SelectItem value="1024">1024x1024 (Recommended)</SelectItem>
                        <SelectItem value="1536">1536x1536</SelectItem>
                        <SelectItem value="2048">2048x2048 (High Quality)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lighting">Lighting Style</Label>
                    <Select value={lightingStyle} onValueChange={setLightingStyle}>
                      <SelectTrigger id="lighting">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="studio">Studio</SelectItem>
                        <SelectItem value="soft">Soft Light</SelectItem>
                        <SelectItem value="natural">Natural</SelectItem>
                        <SelectItem value="dramatic">Dramatic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model-body">Model Body Type</Label>
                    <Select value={modelBodyType} onValueChange={setModelBodyType}>
                      <SelectTrigger id="model-body">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="petite">Petite</SelectItem>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                        <SelectItem value="xl">Extra Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="detail-level">Detail Level</Label>
                    <span className="text-sm font-semibold text-blue-600">{detailLevel[0]}/10</span>
                  </div>
                  <Slider
                    id="detail-level"
                    min={1}
                    max={10}
                    step={1}
                    value={detailLevel}
                    onValueChange={setDetailLevel}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Video Settings */}
            {showVideoSettings && (
              <Card>
                <CardHeader>
                  <CardTitle>Video Settings</CardTitle>
                  <CardDescription>Configure video generation parameters</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (seconds)</Label>
                    <Select value={videoDuration} onValueChange={setVideoDuration}>
                      <SelectTrigger id="duration">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 seconds</SelectItem>
                        <SelectItem value="30">30 seconds</SelectItem>
                        <SelectItem value="60">60 seconds</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fps">Frame Rate</Label>
                    <Select value={frameRate} onValueChange={setFrameRate}>
                      <SelectTrigger id="fps">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24">24 FPS</SelectItem>
                        <SelectItem value="30">30 FPS</SelectItem>
                        <SelectItem value="60">60 FPS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="video-style">Video Style</Label>
                    <Select value={videoStyle} onValueChange={setVideoStyle}>
                      <SelectTrigger id="video-style">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rotate">Rotate</SelectItem>
                        <SelectItem value="pan">Pan & Scan</SelectItem>
                        <SelectItem value="zoom">Zoom In</SelectItem>
                        <SelectItem value="showcase">Showcase</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Iteration Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Iteration Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="iteration">Generation Mode</Label>
                  <Select value={iterationMode} onValueChange={setIterationMode}>
                    <SelectTrigger id="iteration">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single Design</SelectItem>
                      <SelectItem value="variations">Multiple Variations (3)</SelectItem>
                      <SelectItem value="grid">Grid Variations (9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Create Button */}
            <Button
              onClick={handleGeneratePresentation}
              disabled={isLoading || (!textPrompt && !uploadedImage)}
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Presentation...
                </>
              ) : (
                "Create Presentation"
              )}
            </Button>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>Your generated presentation will appear here</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {generatedContent ? (
                  <div className="space-y-4">
                    <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden">
                      {generatedContent.type.includes("3d") || generatedContent.type.includes("video") ? (
                        <video src={generatedContent.url} className="w-full h-full object-cover" autoPlay loop />
                      ) : (
                        <img src={generatedContent.url} alt="Generated" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex flex-col items-center justify-center text-center text-slate-500">
                    <ImageIcon className="h-12 w-12 mb-2 text-slate-400" />
                    <p className="text-sm">Your presentation will appear here once generated</p>
                  </div>
                )}

                {/* Summary Info */}
                <div className="p-3 bg-slate-50 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Type:</span>
                    <span className="font-semibold text-slate-900 capitalize">{inputMethod.replace("-", " ")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Format:</span>
                    <span className="font-semibold text-slate-900 capitalize">{outputFormat}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Resolution:</span>
                    <span className="font-semibold text-slate-900">{resolution}x{resolution}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Est. Time:</span>
                    <span className="font-semibold text-slate-900">30-60 seconds</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
