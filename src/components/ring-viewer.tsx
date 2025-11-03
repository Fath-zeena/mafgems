"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box, Torus, Cylinder } from "@react-three/drei";
import { useCustomizer } from "@/context/customizer-context";

// A custom component to create an emerald cut gem shape
function EmeraldCutGem({ color, width, height, depth }: { color: string; width: number; height: number; depth: number }) {
  const materialProps = {
    color: color,
    roughness: 0,
    transmission: 1,
    thickness: 2,
    ior: 2.417, // Precise Index of Refraction for diamond
    reflectivity: 1,
  };

  return (
    // The gem itself is not rotated here; rotation is applied in the Ring component
    // to align with the prongs.
    <Box args={[width, height, depth]}>
      <meshPhysicalMaterial {...materialProps} />
    </Box>
  );
}

function Ring() {
  const { selectedGem } = useCustomizer();

  // Dimensions for the emerald cut gem
  const gemWidth = 0.6;
  const gemDepth = 0.4;
  const gemHeight = 0.3; // Total height of the gem

  // Position of the gem's center relative to the ring band
  const gemPositionY = 0.7; 

  // Prongs will extend from just above the band to slightly above the gem's top surface
  const prongsBaseY = 0.5; // Starting Y position for prongs, just above the band
  const prongsTopY = gemPositionY + gemHeight / 2 + 0.05; // Ending Y position, slightly above gem
  const prongsHeight = prongsTopY - prongsBaseY;
  const prongsCenterY = prongsBaseY + prongsHeight / 2;

  // Rotation for the gem and prongs to match the image
  const rotationAngle = Math.PI / 4; // 45 degrees

  // Calculate prong offsets for a rotated rectangle
  const halfWidth = gemWidth / 2;
  const halfDepth = gemDepth / 2;

  // Corners of the unrotated rectangle
  const corners = [
    [halfWidth, halfDepth],
    [-halfWidth, halfDepth],
    [halfWidth, -halfDepth],
    [-halfWidth, -halfDepth],
  ];

  const prongPositions: [number, number, number][] = corners.map(([x, z]) => {
    const rotatedX = x * Math.cos(rotationAngle) - z * Math.sin(rotationAngle);
    const rotatedZ = x * Math.sin(rotationAngle) + z * Math.cos(rotationAngle);
    return [rotatedX, prongsCenterY, rotatedZ];
  });

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

      {/* Four-Prong Setting */}
      {prongPositions.map((pos, i) => (
        <Cylinder key={i} args={[0.04, 0.04, prongsHeight, 16]} position={pos}>
           <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </Cylinder>
      ))}
      
      {/* Gemstone - Emerald cut style */}
      {selectedGem && (
        <group position={[0, gemPositionY, 0]} rotation={[0, rotationAngle, 0]}>
          <EmeraldCutGem 
            color={selectedGem.color} 
            width={gemWidth} 
            height={gemHeight} 
            depth={gemDepth} 
          />
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