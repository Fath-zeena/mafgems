"use client";

import { GemGallery } from "@/components/gem-gallery";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomizerProvider } from "@/context/customizer-context";

const DynamicRingViewer = dynamic(
  () => import("@/components/ring-viewer").then((mod) => mod.RingViewer),
  {
    ssr: false,
    loading: () => <Skeleton className="w-full h-full" />,
  }
);

export default function Home() {
  return (
    <CustomizerProvider>
      <div className="flex flex-col md:flex-row h-screen w-screen bg-background text-foreground">
        <aside className="w-full h-[33vh] md:w-80 lg:w-96 md:h-full p-4 overflow-y-auto border-b md:border-b-0 md:border-r border-border">
          <h1 className="text-2xl font-bold mb-4">Jewelry Customizer</h1>
          <GemGallery />
        </aside>
        <main className="flex-1 h-[67vh] md:h-full">
          <DynamicRingViewer />
        </main>
      </div>
    </CustomizerProvider>
  );
}