"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { OvalCutGem } from "./gem-model";

export default function Gem3DViewer({ src }: { src?: string }) {
  // For now we ignore `src` and render a procedural gem
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Environment preset="studio" />
      <group position={[0, -0.1, 0]}>
        <OvalCutGem color="#b3d4ff" gemName="Sapphire" />
      </group>
      <OrbitControls enablePan={false} />
    </Canvas>
  );
}
