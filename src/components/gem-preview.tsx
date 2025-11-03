"use client";

import { memo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { OvalCutGem } from "./oval-cut-gem";
import type { Gem } from "@/types";

const GemPreview = memo(({ gem }: { gem: Gem }) => {
  return (
    <div className="w-[80px] h-[80px] rounded-md cursor-grab">
      <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }}>
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
          autoRotate
          autoRotateSpeed={4}
        />
      </Canvas>
    </div>
  );
});

GemPreview.displayName = "GemPreview";

export { GemPreview };