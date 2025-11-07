"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Torus, Cylinder } from "@react-three/drei";
import { useCustomizer } from "@/context/customizer-context";
import { OvalCutGem } from "./gem-model";

export function Ring() {
  const { selectedGem } = useCustomizer();
  return (
    <group position-y={0.11}>
      <Torus args={[1, 0.06, 32, 100]} rotation={[Math.PI / 2, Math.PI / 2, 0]} scale={[1, 1, 1.5]}>
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </Torus>
      <group rotation-y={Math.PI / 2}>
        <Cylinder args={[0.6, 0.6, 0.08, 64]} position={[0, 1.1, 0]} scale={[0.8, 1, 1.2]}>
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </Cylinder>
        <Cylinder args={[0.6, 0.6, 0.05, 64]} position={[0, 1.1 + 0.08 / 2 + 0.05 / 2, 0]} scale={[0.8, 1, 1.2]}>
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </Cylinder>
        {selectedGem && (
          <group position={[0, 1.1 + 0.08 / 2 + 0.05, 0]}>
            <OvalCutGem color={selectedGem.color} gemName={selectedGem.name} />
          </group>
        )}
      </group>
    </group>
  );
}

export function RingViewer() {
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
      <Canvas camera={{ position: [3, 2, 3], fov: 45 }}>
        <ambientLight intensity={Math.PI} />
        <spotLight position={[3, 5, 3]} angle={0.7} penumbra={1} decay={0} intensity={Math.PI / 3} />
        <spotLight position={[0, 2, 0]} angle={0.3} penumbra={0.5} decay={0} intensity={Math.PI / 2} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Ring />
        <OrbitControls target={[0, 0.75, 0]} />
      </Canvas>
    </div>
  );
}