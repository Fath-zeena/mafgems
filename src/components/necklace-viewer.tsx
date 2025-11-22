"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Torus, Cylinder, Sphere } from "@react-three/drei";
import { useCustomizer } from "@/context/customizer-context";
import { OvalCutGem } from "./gem-models"; // <-- Ensure OvalCutGem is imported from the external file
import * as THREE from 'three';

// --- Necklace Model ---

function Necklace() {
  const { selectedGem } = useCustomizer();
  const goldMaterial = new THREE.MeshStandardMaterial({ color: "#FFD700", metalness: 0.8, roughness: 0.2 });

  const prongHeight = 0.3;
  const prongThickness = 0.04;
  const prongXOffset = 0.4;
  const prongZOffset = 0.6;

  const prongPositions: [number, number, number][] = [
    [prongXOffset, 0, prongZOffset],
    [-prongXOffset, 0, prongZOffset],
    [prongXOffset, 0, -prongZOffset],
    [-prongXOffset, 0, -prongZOffset],
  ];

  return (
    <group>
      <Torus args={[2.5, 0.03, 32, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </Torus>
      <group position={[0, -2.5, 0]}>
        {/* Four-Prong Setting */}
        {prongPositions.map((pos, i) => (
          <Cylinder key={i} args={[prongThickness, prongThickness, prongHeight, 16]} position={pos}>
            <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
          </Cylinder>
        ))}
        {selectedGem && (
          <group position-y={0.1}>
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
        <ambientLight intensity={Math.PI} />
        <spotLight position={[5, 5, 5]} angle={0.7} penumbra={1} decay={0} intensity={Math.PI / 3} />
        <spotLight position={[-5, 5, 5]} angle={0.7} penumbra={1} decay={0} intensity={Math.PI / 3} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Necklace />
        <OrbitControls target={[0, -1, 0]} />
      </Canvas>
    </div>
  );
}