"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

// Dynamically import the client-only Canvas component with ssr: false
const RingViewerCanvas = dynamic(
  () => import("@/components/ring-viewer-client").then((mod) => mod.RingViewerCanvas),
  {
    ssr: false,
    loading: () => <Skeleton className="w-full h-full" />,
  }
);

export function RingViewer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Skeleton className="w-full h-full" />;
  }

  return <RingViewerCanvas />;
}
