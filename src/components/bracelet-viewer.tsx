"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Cylinder, Torus, Sphere } from "@react-three/drei";
import { useCustomizer } from "@/context/customizer-context";
import * as THREE from 'three';

// --- Reusable Gem Models (Self-Contained) ---

// Oval Cut Gem (Main Gem)
function OvalCutGem({ color, gemName, scale = 1 }: { color: string; gemName?: string; scale?: number }) {
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

  const girdleRadius = 0.55 * scale;
  const crownHeight = 0.1 * scale;
  const pavilionHeight = 0.25 * scale;
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

// Round Cut Gem (Side Gems)
function RoundCutGem({ color, gemName, scale = 1 }: { color: string; gemName?: string; scale?: number }) {
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
  }

  const radius = 0.2 * scale;
  const height = 0.15 * scale;
  const facets = 12;

  return (
    <group rotation={[Math.PI, 0, 0]}>
      <Cylinder args={[radius, radius, height * 0.3, facets]} position={[0, height * 0.15, 0]}>
        <meshPhysicalMaterial {...materialProps} />
      </Cylinder>
      <Cylinder args={[radius, 0, height * 0.7, facets]} position={[0, -height * 0.35, 0]}>
        <meshPhysicalMaterial {...materialProps} />
      </Cylinder>
    </group>
  );
}

// --- Bracelet Model ---

function Bracelet() {
  const { selectedGem } = useCustomizer();
  const goldMaterial = new THREE.MeshStandardMaterial({ color: "#FFD700", metalness: 0.8, roughness: 0.2 });

  // Bracelet Cuff Shape (Cylinder cut open)
  const cuffRadius = 2.5;
  const cuffHeight = 1.5;
  const cuffThickness = 0.1;

  return (
    <group rotation={[0, Math.PI / 2, 0]}>
      {/* Main Cuff Band */}
      <Cylinder args={[cuffRadius, cuffRadius, cuffHeight, 64, 1, false, 0, Math.PI * 1.7]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} side={THREE.DoubleSide} />
      </Cylinder>

      {/* Decorative Center Panel */}
      <group position={[0, 0, cuffRadius * 0.5]}>
        {/* Center Oval Gem Slot (Large) */}
        {selectedGem && (
          <group position={[0, 0, 0.05]}>
            <OvalCutGem color={selectedGem.color} gemName={selectedGem.name} scale={0.8} />
          </group>
        )}
        
        {/* Side Gem Slots (Small) */}
        {selectedGem && (
          <>
            {/* Left Side Gems */}
            <group position={[-1.2, 0.3, 0.05]}>
              <RoundCutGem color={selectedGem.color} gemName={selectedGem.name} scale={0.5} />
            </group>
            <group position={[-1.2, -0.3, 0.05]}>
              <RoundCutGem color={selectedGem.color} gemName={selectedGem.name} scale={0.5} />
            </group>
            
            {/* Right Side Gems */}
            <group position={[1.2, 0.3, 0.05]}>
              <RoundCutGem color={selectedGem.color} gemName={selectedGem.name} scale={0.5} />
            </group>
            <group position={[1.2, -0.3, 0.05]}>
              <RoundCutGem color={selectedGem.color} gemName={selectedGem.name} scale={0.5} />
            </group>
          </>
        )}
        
        {/* Decorative Beading (Simplified) */}
        <Torus args={[0.8, 0.05, 16, 32]} rotation={[Math.PI / 2, 0, 0]} material={goldMaterial} />
      </group>
    </group>
  );
}

// --- Viewer Component ---

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
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={Math.PI} />
        <spotLight position={[5, 5, 5]} angle={0.7} penumbra={1} decay={0} intensity={Math.PI / 3} />
        <spotLight position={[-5, 5, 5]} angle={0.7} penumbra={1} decay={0} intensity={Math.PI / 3} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Bracelet />
        <OrbitControls target={[0, 0, 2.5]} />
      </Canvas>
    </div>
  );
}