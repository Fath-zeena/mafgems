"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Torus, Cylinder } from "@react-three/drei";
import { useCustomizer } from "@/context/customizer-context";
import * as THREE from 'three';

// Reusing the OvalCutGem logic directly to ensure compatibility
function OvalCutGem({ color, gemName }: { color: string; gemName?: string }) {
  let materialProps: any = {
    color: color,
    roughness: 0,
    transmission: 1,
    thickness: 2,
    ior: 2.417,
    reflectivity: 1,
  };

  if (gemName === "Diamond") {
    materialProps = { ...materialProps, color: "#F0F0F0", roughness: 0.1, transmission: 0.9, clearcoat: 0.5, clearcoatRoughness: 0.1 };
  } else if (gemName === "Alexandrite") {
    materialProps = { ...materialProps, color: "#6A0DAD", clearcoat: 1, clearcoatRoughness: 0.1, sheen: 1, sheenColor: "#00CED1", transmission: 0.8 };
  }

  const girdleRadius = 0.55;
  const crownHeight = 0.1;
  const pavilionHeight = 0.25;
  const facets = 16;

  return (
    <group rotation={[Math.PI, 0, 0]} scale={[0.8, 1, 1.2]}>
      <Cylinder args={[girdleRadius, girdleRadius, crownHeight, facets]} position={[0, crownHeight / 2, 0]}>
        <meshPhysicalMaterial {...materialProps} />
      </Cylinder>
      <Cylinder args={[girdleRadius, girdleRadius * 0.4, pavilionHeight, facets]} position={[0, -pavilionHeight / 2, 0]}>
        <meshPhysicalMaterial {...materialProps} />
      </Cylinder>
    </group>
  );
}

// The new simple Chain Bracelet component
function Bracelet() {
  const { selectedGem } = useCustomizer();
  const goldMaterial = new THREE.MeshStandardMaterial({ color: "#FFD700", metalness: 0.8, roughness: 0.2 });

  // Reuse the crown/setting logic from the Ring viewer
  const crownBaseHeight = 0.08;
  const wallHeight = 0.05;
  const crownBaseRadius = 0.6;
  const crownBaseScaleX = 0.8;
  const crownBaseScaleZ = 1.2;

  return (
    <group>
      {/* Simple Chain - represented by a large thin torus */}
      <Torus args={[2.8, 0.05, 16, 100]} rotation={[Math.PI / 2, 0, 0]} material={goldMaterial} />

      {/* The Crown Setting - positioned at the front of the chain */}
      <group position={[0, 0, 2.8]} rotation={[Math.PI / 2, 0, 0]}>
        {/* Base */}
        <Cylinder args={[crownBaseRadius, crownBaseRadius, crownBaseHeight, 64]} position={[0, -crownBaseHeight/2, 0]} scale={[crownBaseScaleX, 1, crownBaseScaleZ]} material={goldMaterial} />
        {/* Wall */}
        <Cylinder args={[crownBaseRadius, crownBaseRadius, wallHeight, 64]} position={[0, crownBaseHeight/2, 0]} scale={[crownBaseScaleX, 1, crownBaseScaleZ]} material={goldMaterial} />
        
        {/* Gemstone */}
        {selectedGem && (
          <group position={[0, crownBaseHeight, 0]}>
            <OvalCutGem color={selectedGem.color} gemName={selectedGem.name} />
          </group>
        )}
      </group>
    </group>
  );
}

export function BraceletViewer() {
  const { setSelectedGem } = useCustomizer();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const gemDataString = e.dataTransfer.getData("application/json");
    if (gemDataString) {
      try {
        const gem = JSON.parse(gemDataString);
        setSelectedGem(gem);
      } catch (error) {
        console.error("Failed to parse dropped gem data:", error);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="w-full h-full bg-gray-200 dark:bg-gray-950" onDrop={handleDrop} onDragOver={handleDragOver}>
      <Canvas camera={{ position: [0, 5, 5], fov: 45 }}>
        <ambientLight intensity={Math.PI} />
        <spotLight position={[5, 5, 5]} angle={0.7} penumbra={1} decay={0} intensity={Math.PI / 3} />
        <spotLight position={[-5, 5, 5]} angle={0.7} penumbra={1} decay={0} intensity={Math.PI / 3} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Bracelet />
        <OrbitControls target={[0, 0, 0]} />
      </Canvas>
    </div>
  );
}