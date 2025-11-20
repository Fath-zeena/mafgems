"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Torus, Cylinder } from "@react-three/drei";
import { useCustomizer } from "@/context/customizer-context";

// Self-contained gem model for the pendant viewer
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

// The Pendant model
function Pendant() {
  const { selectedGem } = useCustomizer();

  const settingHeight = 0.3;
  const settingThickness = 0.04;
  const settingXOffset = 0.4;
  const settingZOffset = 0.6;

  const prongPositions: [number, number, number][] = [
    [settingXOffset, 0, settingZOffset],
    [-settingXOffset, 0, settingZOffset],
    [settingXOffset, 0, -settingZOffset],
    [-settingXOffset, 0, -settingZOffset],
  ];

  return (
    <group>
      {/* Bail (Loop for chain) */}
      <Torus args={[0.15, 0.03, 16, 32]} position={[0, 0.8, 0]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </Torus>

      {/* Main Setting */}
      <group position={[0, 0, 0]}>
        {/* Base/Backing */}
        <Cylinder args={[0.5, 0.5, 0.05, 32]} rotation={[Math.PI / 2, 0, 0]} scale={[0.8, 1, 1.2]}>
           <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </Cylinder>

        {/* Prongs */}
        {prongPositions.map((pos, i) => (
          <Cylinder key={i} args={[settingThickness, settingThickness, settingHeight, 16]} position={pos}>
            <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
          </Cylinder>
        ))}

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

export function PendantViewer() {
  const { setSelectedGem } = useCustomizer();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation(); // Stop propagation to ensure clean handling
    const gemDataString = e.dataTransfer.getData("application/json");
    
    if (gemDataString) {
      try {
        const gem = JSON.parse(gemDataString);
        console.log("Dropped gem data:", gem); // Debugging log
        setSelectedGem(gem);
      } catch (error) {
        console.error("Failed to parse dropped gem data:", error);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy'; // Explicitly set drop effect
  };

  return (
    <div 
      className="w-full h-full bg-gray-200 dark:bg-gray-950"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={Math.PI} />
        <spotLight position={[5, 5, 5]} angle={0.7} penumbra={1} decay={0} intensity={Math.PI / 3} />
        <spotLight position={[-5, 5, 5]} angle={0.7} penumbra={1} decay={0} intensity={Math.PI / 3} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Pendant />
        <OrbitControls target={[0, 0, 0]} />
      </Canvas>
    </div>
  );
}