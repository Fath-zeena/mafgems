"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GenerateVideoForm } from "@/components/admin/generate-video-form";
import { Video } from "lucide-react";

interface VideoGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectionTitle?: string;
  onVideoGenerated?: (videoUrl: string, videoData: any) => void;
}

export function VideoGeneratorModal({
  isOpen,
  onClose,
  collectionTitle,
  onVideoGenerated,
}: VideoGeneratorModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            Generate Jewelry Video with Human Model
          </DialogTitle>
          <DialogDescription>
            Create professional Instagram-ready videos showcasing your jewelry designs with AI-powered human models. Perfect for social media marketing.
          </DialogDescription>
        </DialogHeader>

        <GenerateVideoForm
          collectionTitle={collectionTitle}
          onSuccess={(videoUrl, videoData) => {
            if (onVideoGenerated) {
              onVideoGenerated(videoUrl, videoData);
            }
          }}
          setOpen={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
