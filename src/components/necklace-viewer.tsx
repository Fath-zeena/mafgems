"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Torus, Cylinder, Sphere } from "@react-three/drei";
import { useCustomizer } from "@/context/customizer-context";
import * as THREE from 'three';

// The OvalCutGem component is defined inside this file.
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
    <group rotation={[Math.PI, 0, 0]} scale={[0.8, 1.2, 1]}>
      <Cylinder args={[girdleRadius, girdleRadius, crownHeight, facets]} position={[0, crownHeight / 2, 0]}>
        <meshPhysicalMaterial {...materialProps} />
      </Cylinder>
      <Cylinder args={[girdleRadius, girdleRadius * 0.4, pavilionHeight, facets]} position={[0, -pavilionHeight / 2, 0]}>
        <meshPhysicalMaterial {...materialProps} />
      </Cylinder>
    </group>
  );
}

// Helper component for the decorative sphere clusters (granulation)
function GranulationCluster({ scale = 1 }: { scale?: number }) {
  const sphereRadius = 0.03 * scale;
  const offset = 0.04 * scale;
  return (
    <group>
      <Sphere args={[sphereRadius, 16, 16]} position={[0, 0, 0]} />
      <Sphere args={[sphereRadius, 16, 16]} position={[offset, 0, 0]} />
      <Sphere args={[sphereRadius, 16, 16]} position={[-offset, 0, 0]} />
      <Sphere args={[sphereRadius, 16, 16]} position={[0, offset, 0]} />
      <Sphere args={[sphereRadius, 16, 16]} position={[0, -offset, 0]} />
    </group>
  );
}

// The main Necklace component with the new design
function Necklace() {
  const { selectedGem } = useCustomizer();
  const roseGoldMaterial = new THREE.MeshStandardMaterial({ color: "#B76E79", metalness: 0.8, roughness: 0.2 });

  return (
    <group>
      {/* Chain */}
      <Torus args={[3, 0.02, 32, 100]} rotation={[Math.PI / 2, 0, 0]} material={roseGoldMaterial} />

      {/* Pendant Assembly */}
      <group position={[0, -3, 0]}>
        {/* Bail (connector) */}
        <group position={[0, 0.9, 0]}>
          <Torus args={[0.15, 0.02, 16, 32]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.2, 0]} material={roseGoldMaterial} />
          <group position={[0, 0.05, 0]}>
            <GranulationCluster scale={0.8} />
          </group>
        </group>

        {/* Main Pendant */}
        <group scale={[0.8, 1.2, 1]}>
          {/* Outer Filigree Frame */}
          <Torus args={[0.7, 0.03, 16, 16]} rotation={[Math.PI / 2, 0, 0]} material={roseGoldMaterial} />
          {/* Rope Detail */}
          <Torus args={[0.6, 0.04, 16, 64]} rotation={[Math.PI / 2, 0, 0]} material={roseGoldMaterial} />
          {/* Bezel Wall */}
          <Cylinder args={[0.55, 0.55, 0.1, 64]} position={[0, 0, 0]} material={roseGoldMaterial} />

          {/* Granulation Prongs */}
          <group position={[0.5, 0, 0]} rotation={[0, 0, -Math.PI / 12]}><GranulationCluster /></group>
          <group position={[-0.5, 0, 0]} rotation={[0, 0, Math.PI / 12]}><GranulationCluster /></group>
          <group position={[0, 0, 0.65]} rotation={[Math.PI / 12, 0, 0]}><GranulationCluster /></group>
          <group position={[0, 0, -0.65]} rotation={[-Math.PI / 12, 0, 0]}><GranulationCluster /></group>
        </group>

        {/* Gemstone */}
        {selectedGem && (
          <group position-y={0.05}>
            <OvalCutGem color={selectedGem.color} gemName={selectedGem.name} />
          </group>
        )}
      </group>
    </group>
  );
}

export function NecklaceViewer() {
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
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={Math.PI * 0.5} />
        <spotLight position={[5, 5, 5]} angle={0.7} penumbra={1} decay={0} intensity={Math.PI} />
        <spotLight position={[-5, 5, 5]} angle={0.7} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Necklace />
        <OrbitControls target={[0, -3, 0]} />
      </Canvas>
    </div>
  );
}