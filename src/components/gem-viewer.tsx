"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Video, Image as ImageIcon } from "lucide-react";
import type { Gem } from "@/types";

// Dynamically import react-three-fiber viewer to avoid SSR issues
const Viewer = dynamic(() => import("./gem-3d-viewer"), { ssr: false, loading: () => null });

export function GemViewer({ gem, open, onClose }: { gem: Gem; open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<"images" | "model" | "video">("images");

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-4xl w-full max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{gem.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Tabs value={tab} onValueChange={(v: any) => setTab(v)}>
            <TabsList>
              <TabsTrigger value="images" className="gap-2"><ImageIcon className="h-4 w-4" /> Images</TabsTrigger>
              <TabsTrigger value="model" className="gap-2"><ImageIcon className="h-4 w-4" /> 3D</TabsTrigger>
              <TabsTrigger value="video" className="gap-2"><Video className="h-4 w-4" /> Video</TabsTrigger>
            </TabsList>

            <TabsContent value="images">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(gem.image_urls || [gem.image_url]).filter(Boolean).map((src, idx) => (
                  <div key={idx} className="overflow-hidden rounded-lg bg-gray-100">
                    <img src={src} alt={`${gem.name} ${idx + 1}`} className="w-full h-80 object-contain" />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="model">
              {gem.model3d_url ? (
                <div className="h-[480px] bg-black/5 rounded-lg overflow-hidden">
                  <Viewer src={gem.model3d_url} />
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">No 3D model available for this gem.</div>
              )}
            </TabsContent>

            <TabsContent value="video">
              {gem.video_urls && gem.video_urls.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {gem.video_urls.map((v, i) => (
                    <video key={i} src={v} controls className="w-full aspect-video bg-black rounded-md" />
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">No videos available for this gem.</div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button variant="ghost" onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
