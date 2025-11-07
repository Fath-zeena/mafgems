"use client";

import { GemGallery } from "@/components/gem-gallery";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomizerProvider } from "@/context/customizer-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DynamicRingViewer = dynamic(
  () => import("@/components/ring-viewer").then((mod) => mod.RingViewer),
  {
    ssr: false,
    loading: () => <Skeleton className="w-full h-full" />,
  }
);

const DynamicNecklaceViewer = dynamic(
  () => import("@/components/necklace-viewer").then((mod) => mod.NecklaceViewer),
  {
    ssr: false,
    loading: () => <Skeleton className="w-full h-full" />,
  }
);

export default function CustomizerPage() {
  return (
    <CustomizerProvider>
      <div className="flex flex-col md:flex-row h-screen w-screen bg-background text-foreground">
        <aside className="w-full md:w-80 lg:w-96 md:h-full p-4 overflow-y-auto border-b md:border-b-0 md:border-r border-border">
          <h1 className="text-2xl font-bold mb-4">Jewelry Customizer</h1>
          <GemGallery />
        </aside>
        <main className="flex-1 h-full">
          <Tabs defaultValue="ring" className="w-full h-full flex flex-col">
            <TabsList className="mx-auto mt-2">
              <TabsTrigger value="ring">Ring</TabsTrigger>
              <TabsTrigger value="necklace">Necklace</TabsTrigger>
            </TabsList>
            <TabsContent value="ring" className="flex-grow">
              <DynamicRingViewer />
            </TabsContent>
            <TabsContent value="necklace" className="flex-grow">
              <DynamicNecklaceViewer />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </CustomizerProvider>
  );
}