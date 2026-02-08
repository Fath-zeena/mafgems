"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Share2, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Presentation {
  id: string;
  input_method: string;
  jewelry_type: string;
  output_type: string;
  output_url: string;
  created_at: string;
  configuration: any;
}

export function PresentationGallery() {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPresentation, setSelectedPresentation] = useState<Presentation | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchPresentations();
  }, []);

  const fetchPresentations = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setPresentations([]);
        return;
      }

      const { data, error } = await supabase
        .from("presentation_generations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching presentations:", error);
        toast.error("Failed to load presentations");
        return;
      }

      setPresentations(data || []);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load presentations");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (url: string, jewelryType: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${jewelryType}-presentation-${Date.now()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      toast.success("Download started!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download presentation");
    }
  };

  const handleShare = async (url: string) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "AI Jewellery Presentation",
          url: url,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(url);
        toast.success("URL copied to clipboard!");
      }
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("presentation_generations")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete presentation");
        return;
      }

      setPresentations(presentations.filter((p) => p.id !== id));
      toast.success("Presentation deleted");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete presentation");
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    );
  }

  if (presentations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No presentations yet</p>
        <Button asChild>
          <a href="/presentation">Create Your First Presentation</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Presentations</h2>
        <span className="text-sm text-gray-600">{presentations.length} total</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {presentations.map((presentation) => (
          <Card key={presentation.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square bg-gray-200 relative group overflow-hidden">
              {presentation.output_type === "video" ? (
                <video
                  src={presentation.output_url}
                  className="w-full h-full object-cover"
                  controls
                />
              ) : (
                <img
                  src={presentation.output_url}
                  alt={presentation.jewelry_type}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              )}
              
              {/* Overlay with View button */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setSelectedPresentation(presentation)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>{presentation.jewelry_type} - {presentation.input_method}</DialogTitle>
                      <DialogDescription>
                        Created {new Date(presentation.created_at).toLocaleDateString()}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      {presentation.output_type === "video" ? (
                        <video
                          src={presentation.output_url}
                          className="w-full h-full object-cover"
                          controls
                          autoPlay
                        />
                      ) : (
                        <img
                          src={presentation.output_url}
                          alt={presentation.jewelry_type}
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <CardContent className="p-4">
              <h3 className="font-semibold capitalize mb-1">{presentation.jewelry_type}</h3>
              <p className="text-xs text-gray-600 mb-3 capitalize">
                {presentation.input_method.replace(/-/g, " ")} → {presentation.output_type}
              </p>
              <p className="text-xs text-gray-500 mb-4">
                {new Date(presentation.created_at).toLocaleDateString()}
              </p>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleDownload(presentation.output_url, presentation.jewelry_type)}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleShare(presentation.output_url)}
                >
                  <Share2 className="h-3 w-3 mr-1" />
                  Share
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDelete(presentation.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
