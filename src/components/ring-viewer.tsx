import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import the client-only Canvas component with ssr: false
const RingViewerCanvas = dynamic(
  () => import("@/components/ring-viewer-client").then((mod) => mod.RingViewerCanvas),
  {
    ssr: false,
    loading: () => <Skeleton className="w-full h-full" />,
  }
);

export function RingViewer() {
  return <RingViewerCanvas />;
}
