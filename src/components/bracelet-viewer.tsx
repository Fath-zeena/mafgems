"use client";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Cylinder, Torus } from "@react-three/drei";
import { useCustomizer } from "@/context/customizer-context";

// Self-contained gem component
function OvalCutGem({ color, gemName }: { color: string; gemName?: string }) {
  const isDiamond = gemName === "Diamond";
  const isAlexandrite = gemName === "Alexandrite";

  return (
    <group rotation={[Math.PI, 0, 0]} scale={[0.8, 1, 1.2]}>
      <Cylinder args={[0.55, 0.55, 0.1, 16]} position={[0, 0.05, 0]}>
        <meshPhysicalMaterial 
          color={isDiamond ? "#F0F0F0" : (isAlexandrite ? "#6A0DAD" : color)}
          roughness={isDiamond ? 0.1 : 0}
          transmission={isDiamond ? 0.9 : (isAlexandrite ? 0.8 : 1)}
          thickness={2}
          ior={2.417}
          reflectivity={1}
          clearcoat={isDiamond || isAlexandrite ? (isDiamond ? 0.5 : 1) : 0}
          clearcoatRoughness={0.1}
          sheen={isAlexandrite ? 1 : 0}
          sheenColor={isAlexandrite ? "#00CED1" : undefined}
        />
      </Cylinder>
      <Cylinder args={[0.55, 0.22, 0.25, 16]} position={[0, -0.125, 0]}>
        <meshPhysicalMaterial 
          color={isDiamond ? "#F0F0F0" : (isAlexandrite ? "#6A0DAD" : color)}
          roughness={isDiamond ? 0.1 : 0}
          transmission={isDiamond ? 0.9 : (isAlexandrite ? 0.8 : 1)}
          thickness={2}
          ior={2.417}
          reflectivity={1}
          clearcoat={isDiamond || isAlexandrite ? (isDiamond ? 0.5 : 1) : 0}
          clearcoatRoughness={0.1}
          sheen={isAlexandrite ? 1 : 0}
          sheenColor={isAlexandrite ? "#00CED1" : undefined}
        />
      </Cylinder>
    </group>
  );
}

function Bracelet() {
  const { selectedGem } = useCustomizer();

  const crownBaseHeight = 0.08;
  const wallHeight = 0.05;
  const crownBaseRadius = 0.6;
  const crownBaseScaleX = 0.8;
  const crownBaseScaleZ = 1.2;

  return (
    <group rotation={[0, Math.PI / 2, 0]}>
      {/* Bracelet Band (Cuff style) */}
      <Cylinder 
        args={[2.5, 2.5, 1.5, 64, 1, false, 0, Math.PI * 1.7]} 
        rotation={[Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]}
      >
        <meshStandardMaterial 
          color="#FFD700" 
          metalness={0.8} 
          roughness={0.2} 
          side={THREE.DoubleSide} 
        />
      </Cylinder>

      {/* Decorative Crown Setting */}
      <group position={[0, 0, 2.5]} rotation={[Math.PI / 2, 0, 0]}>
        {/* Crown Base */}
        <Cylinder 
          args={[crownBaseRadius, crownBaseRadius, crownBaseHeight, 64]} 
          position={[0, -crownBaseHeight/2, 0]} 
          scale={[crownBaseScaleX, 1, crownBaseScaleZ]}
        >
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </Cylinder>
        
        {/* Crown Wall */}
        <Cylinder 
          args={[crownBaseRadius, crownBaseRadius, wallHeight, 64]} 
          position={[0, crownBaseHeight/2, 0]} 
          scale={[crownBaseScaleX, 1, crownBaseScaleZ]}
        >
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </Cylinder>
        
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
      <Canvas camera={{ position: [0, 5, 8], fov: 45 }}>
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