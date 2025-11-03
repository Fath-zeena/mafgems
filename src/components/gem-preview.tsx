"use client";

import { memo, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { OvalCutGem } from "./oval-cut-gem";
import type { Gem } from "@/types";

// Inner component to handle Three.js scene and cleanup
function GemScene({ gem }: { gem: Gem }) {
  const { gl, scene } = useThree();

  useEffect(() => {
    // Cleanup function when component unmounts
    return () => {
      // Dispose of scene objects if necessary (though R3F usually handles this)
      // For example, if you had custom geometries/materials not managed by R3F
      scene.traverse((object: any) => {
        if (object.isMesh) {
          object.geometry?.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((material: any) => material.dispose());
          } else {
            object.material?.dispose();
          }
        }
      });
      // Explicitly dispose of the WebGL renderer
      gl.dispose();
    };
  }, [gl, scene]);

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
        autoRotate
        autoRotateSpeed={4}
      />
    </>
  );
}

const GemPreview = memo(({ gem }: { gem: Gem }) => {
  return (
    <div className="w-[80px] h-[80px] rounded-md cursor-grab">
      <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }}>
        <GemScene gem={gem} />
      </Canvas>
    </div>
  );
});

GemPreview.displayName = "GemPreview";

export { GemPreview };