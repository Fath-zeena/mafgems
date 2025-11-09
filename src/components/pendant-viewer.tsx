"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Torus, Cylinder } from "@react-three/drei";
import { useCustomizer } from "@/context/customizer-context";

// The OvalCutGem component is defined inside this file to ensure it's self-contained.
function OvalCutGem({ color, gemName }: { color: string; gemName?: string }) {
  let materialProps: any = { color, roughness: 0, transmission: 1, thickness: 2, ior: 2.417, reflectivity: 1 };
  if (gemName === "Diamond") materialProps = { ...materialProps, color: "#F0F0F0", roughness: 0.1, transmission: 0.9, clearcoat: 0.5, clearcoatRoughness: 0.1 };
  if (gemName === "Alexandrite") materialProps = { ...materialProps, color: "#6A0DAD", clearcoat: 1, clearcoatRoughness: 0.1, sheen: 1, sheenColor: "#00CED1", transmission: 0.8 };
  
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

// The new, stable Pendant component based on the ring's crown.
function Pendant() {
  const { selectedGem } = useCustomizer();

  const pendantBaseHeight = 0.08;
  const wallHeight = 0.05;
  const pendantRadius = 0.6;
  const pendantScaleX = 0.8;
  const pendantScaleZ = 1.2;

  const wallCenterY = pendantBaseHeight / 2 + wallHeight / 2;
  const gemGirdleY = wallCenterY + wallHeight / 2;

  return (
    <group>
      {/* Pendant Setting (copied from ring crown concept) */}
      <group rotation-y={Math.PI / 2}>
        <Cylinder args={[pendantRadius, pendantRadius, pendantBaseHeight, 64]} scale={[pendantScaleX, 1, pendantScaleZ]}>
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </Cylinder>
        <Cylinder args={[pendantRadius, pendantRadius, wallHeight, 64]} position={[0, wallCenterY, 0]} scale={[pendantScaleX, 1, pendantScaleZ]}>
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </Cylinder>
        {selectedGem && (
          <group position={[0, gemGirdleY, 0]}>
            <OvalCutGem color={selectedGem.color} gemName={selectedGem.name} />
          </group>
        )}
      </group>

      {/* Simple Chain Loops */}
      <Torus args={[0.1, 0.02, 16, 32]} position={[pendantRadius * pendantScaleZ, 0.1, 0]} rotation={[0, 0, -Math.PI / 4]}>
         <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </Torus>
      <Torus args={[0.1, 0.02, 16, 32]} position={[-pendantRadius * pendantScaleZ, 0.1, 0]} rotation={[0, 0, Math.PI / 4]}>
         <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </Torus>
    </group>
  );
}

export function PendantViewer() {
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
      <Canvas camera={{ position: [0, 2, 4], fov: 45 }}>
        <ambientLight intensity={Math.PI} />
        <spotLight position={[5, 5, 5]} angle={0.7} penumbra={1} decay={0} intensity={Math.PI} />
        <spotLight position={[-5, 5, 5]} angle={0.7} penumbra={1} decay={0} intensity={Math.PI} />
        <Pendant />
        <OrbitControls target={[0, 0, 0]} />
      </Canvas>
    </div>
  );
}