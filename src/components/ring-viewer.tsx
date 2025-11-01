"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Torus, Cylinder } from "@react-three/drei";
import { useCustomizer } from "@/context/customizer-context";

// A custom component to create a rounded, multi-faceted cushion cut gem shape
function CushionCutGem({ color }: { color: string }) {
  const materialProps = {
    color: color,
    roughness: 0,
    transmission: 1,
    thickness: 2,
    ior: 2.417, // Precise Index of Refraction for diamond
    reflectivity: 1,
  };

  // Dimensions for the cushion cut approximation
  const girdleRadius = 0.4; 
  const crownHeight = 0.15; 
  const pavilionHeight = 0.6; 
  const facets = 16; // Increased facets for a rounded appearance

  // The group origin (0, 0, 0) represents the girdle plane.
  return (
    <group>
      {/* Crown (Prism shape) - Using 16 sides for a rounded look */}
      {/* args: [radiusTop, radiusBottom, height, radialSegments] */}
      <Cylinder 
        args={[girdleRadius, girdleRadius, crownHeight, facets]} 
        position={[0, crownHeight / 2, 0]} // Rests on the girdle plane
      >
        <meshPhysicalMaterial {...materialProps} />
      </Cylinder>
      {/* Pavilion (Pyramid shape) - Tapered base with 16 sides */}
      {/* args: [radiusTop, radiusBottom, height, radialSegments] */}
      <Cylinder 
        args={[girdleRadius, 0, pavilionHeight, facets]} 
        position={[0, -pavilionHeight / 2, 0]} // Hangs below the girdle plane
      >
        <meshPhysicalMaterial {...materialProps} />
      </Cylinder>
    </group>
  );
}

function Ring() {
  const { selectedGem } = useCustomizer();

  // Define positions for the setting
  const crownBaseY = 1.1;
  const prongsCenterY = 1.2;
  const gemGirdleY = 1.2; // The Y position where the gem's girdle sits

  // Adjust prong positions for a square/rounded gem
  const prongOffset = 0.35; 
  const prongPositions: [number, number, number][] = [
    [prongOffset, prongsCenterY, prongOffset],
    [-prongOffset, prongsCenterY, prongOffset],
    [prongOffset, prongsCenterY, -prongOffset],
    [-prongOffset, prongsCenterY, -prongOffset],
  ];

  // The gem group position is set to the girdle height
  const gemPositionY = gemGirdleY;

  return (
    <>
      {/* Ring Band */}
      <Torus 
        args={[1, 0.06, 32, 100]} 
        rotation={[Math.PI / 2, Math.PI / 2, 0]}
        scale={[1, 1, 1.5]}
      >
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </Torus>

      {/* Crown Base - Adjusted size for square gem */}
      {/* args: [radiusTop, radiusBottom, height, radialSegments] */}
      <Cylinder args={[0.5, 0.5, 0.08, 4]} position={[0, crownBaseY, 0]} rotation={[0, Math.PI / 4, 0]}>
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </Cylinder>

      {/* Four-Prong Setting */}
      {prongPositions.map((pos, i) => (
        <Cylinder key={i} args={[0.04, 0.04, 0.3, 16]} position={pos}>
           <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </Cylinder>
      ))}
      
      {/* Gemstone - Cushion cut style */}
      {selectedGem && (
        <group position={[0, gemPositionY, 0]}>
          <CushionCutGem color={selectedGem.color} />
        </group>
      )}
    </>
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
    e.preventDefault(); // Necessary to allow dropping
  };

  return (
    <div 
      className="w-full h-full bg-gray-200 dark:bg-gray-950"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Canvas camera={{ position: [3, 2, 3], fov: 45 }}>
        <ambientLight intensity={Math.PI} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        
        <Ring />

        <OrbitControls target={[0, 0.75, 0]} />
      </Canvas>
    </div>
  );
}