"use client";

import { memo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { OvalCutGem } from "./oval-cut-gem";
import type { Gem } from "@/types";

// Inner component to handle Three.js scene
function GemScene({ gem }: { gem: Gem }) {
  // Removed the useEffect with gl.dispose() to let @react-three/fiber manage context cleanup
  return (
    <>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight
        position={[-10, -10, -10]}
        decay={0}
        intensity={Math.PI}
      />
      <OvalCutGem color={gem.color} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
      />
    </>
  );
}

const GemPreview = memo(({ gem }: { gem: Gem }) => {
  return (
    <div className="w-[80px] h-[80px] rounded-md cursor-grab">
      <Canvas key={gem.id} camera={{ position: [0, 0, 2.5], fov: 50 }}>
        <GemScene gem={gem} />
      </Canvas>
    </div>
  );
});

GemPreview.displayName = "GemPreview";

export { GemPreview };