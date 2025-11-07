"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Torus, Cylinder } from "@react-three/drei";
import { useCustomizer } from "@/context/customizer-context";
import { OvalCutGem } from "./gem-model";

function Necklace() {
  const { selectedGem } = useCustomizer();

  const pendantBaseY = 0;
  const pendantBaseHeight = 0.08;
  const wallHeight = 0.05;

  const wallBaseY = pendantBaseY + pendantBaseHeight / 2;
  const wallCenterY = wallBaseY + wallHeight / 2;
  const gemGirdleY = wallCenterY + wallHeight / 2;

  const pendantBaseRadius = 0.6;
  const pendantBaseScaleX = 0.8;
  const pendantBaseScaleZ = 1.2;

  const gemPositionY = gemGirdleY;

  return (
    <>
      <Torus args={[2.5, 0.03, 32, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </Torus>
      <group position={[0, -2.5, 0]}>
        <Cylinder args={[pendantBaseRadius, pendantBaseRadius, pendantBaseHeight, 64]} position={[0, pendantBaseY, 0]} scale={[pendantBaseScaleX, 1, pendantBaseScaleZ]}>
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </Cylinder>
        <Cylinder args={[pendantBaseRadius, pendantBaseRadius, wallHeight, 64]} position={[0, wallCenterY, 0]} scale={[pendantBaseScaleX, 1, pendantBaseScaleZ]}>
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </Cylinder>
        {selectedGem && (
          <group position={[0, gemPositionY, 0]}>
            <OvalCutGem color={selectedGem.color} gemName={selectedGem.name} />
          </group>
        )}
      </group>
    </>
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