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
        <main className="flex-1 h-full flex flex-col">
          <Tabs defaultValue="ring" className="w-full flex flex-col flex-grow">
            <TabsList className="mx-auto mt-2 flex-shrink-0">
              <TabsTrigger value="ring">Ring</TabsTrigger>
              <TabsTrigger value="necklace">Necklace</TabsTrigger>
            </TabsList>
            <div className="relative flex-grow w-full">
              <TabsContent value="ring" className="absolute inset-0 w-full h-full">
                <DynamicRingViewer />
              </TabsContent>
              <TabsContent value="necklace" className="absolute inset-0 w-full h-full">
                <DynamicNecklaceViewer />
              </TabsContent>
            </div>
          </Tabs>
        </main>
      </div>
    </CustomizerProvider>
  );
}