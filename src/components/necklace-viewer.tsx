"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Torus, Cylinder } from "@react-three/drei";
import { useCustomizer } from "@/context/customizer-context";

// The OvalCutGem component is defined inside this file to ensure it's self-contained.
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
    materialProps = {
      ...materialProps,
      color: "#F0F0F0",
      roughness: 0.1,
      transmission: 0.9,
      clearcoat: 0.5,
      clearcoatRoughness: 0.1,
    };
  } else if (gemName === "Alexandrite") {
    materialProps = {
      ...materialProps,
      color: "#6A0DAD",
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      sheen: 1,
      sheenColor: "#00CED1",
      transmission: 0.8,
    };
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

// A new component for the small, round accent diamond
function AccentDiamond() {
  const materialProps = {
    color: "#F0F0F0",
    roughness: 0.1,
    transmission: 0.9,
    clearcoat: 0.5,
    clearcoatRoughness: 0.1,
    ior: 2.417,
    reflectivity: 1,
  };

  const radius = 0.2;
  const height = 0.15;
  const facets = 12;

  return (
    <group>
      <Cylinder args={[radius, radius, height * 0.3, facets]} position={[0, height * 0.15, 0]}>
        <meshPhysicalMaterial {...materialProps} />
      </Cylinder>
      <Cylinder args={[radius, 0, height * 0.7, facets]} position={[0, -height * 0.35, 0]}>
        <meshPhysicalMaterial {...materialProps} />
      </Cylinder>
    </group>
  );
}

// The Necklace component is also defined here.
function Necklace() {
  const { selectedGem } = useCustomizer();

  const chainRadius = 2.5;
  const linkRadius = 0.05;
  const numLinks = 80;

  return (
    <group>
      {/* Realistic Chain */}
      {Array.from({ length: numLinks }).map((_, i) => {
        const angle = (i / numLinks) * Math.PI;
        const x = Math.cos(angle) * chainRadius;
        const y = Math.sin(angle) * chainRadius;
        return (
          <Torus
            key={i}
            args={[linkRadius, 0.015, 16, 32]}
            position={[x, y, 0]}
            rotation={[0, 0, angle + Math.PI / 2]}
          >
            <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
          </Torus>
        );
      })}

      {/* Pendant */}
      <group position={[0, -chainRadius, 0]}>
        {/* Accent Diamond */}
        <group position={[0, 0.3, 0]}>
          <AccentDiamond />
        </group>

        {/* Main Gemstone */}
        {selectedGem && (
          <group>
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
        <OrbitControls target={[0, 0, 0]} />
      </Canvas>
    </div>
  );
}