"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState, Suspense, lazy } from "react";

// Lazy load the Canvas component - don't evaluate until needed
const RingViewerCanvas = lazy(() => 
  import("@/components/ring-viewer-client").then((mod) => ({ default: mod.RingViewerCanvas }))
);

export function RingViewer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof window === "undefined") {
    return <Skeleton className="w-full h-full" />;
  }

  return (
    <Suspense fallback={<Skeleton className="w-full h-full" />}>
      <RingViewerCanvas />
    </Suspense>
  );
}
