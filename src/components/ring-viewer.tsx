"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Torus, Cylinder } from "@react-three/drei";
import { useCustomizer } from "@/context/customizer-context";

// A custom component to create an oval cut gem shape with a dome top
function OvalCutGem({ color }: { color: string }) {
  const materialProps = {
    color: color,
    roughness: 0,
    transmission: 1,
    thickness: 2,
    ior: 2.417, // Precise Index of Refraction for diamond
    reflectivity: 1,
  };

  // Dimensions for the oval cut - adjusted for shorter, wider dome
  const girdleRadius = 0.55; // Increased size to make it wider
  const crownHeight = 0.1; // Shorter top part
  const pavilionHeight = 0.25; // Shorter bottom part
  const facets = 64;

  return (
    // Rotate the entire gem 180 degrees on the X-axis to flip it upside down
    // Scale on X and Z axes to create an oval shape
    <group rotation={[Math.PI, 0, 0]} scale={[0.8, 1, 1.2]}>
      {/* Crown (Top part of the gem, now at the bottom) */}
      <Cylinder
        args={[girdleRadius, girdleRadius, crownHeight, facets]}
        position={[0, crownHeight / 2, 0]}
      >
        <meshPhysicalMaterial {...materialProps} />
      </Cylinder>

      {/* Pavilion (Bottom part of the gem, now at the top with a dome shape) */}
      {/* The second argument is wider to create a flat, dome-like top */}
      <Cylinder
        args={[girdleRadius, girdleRadius * 0.4, pavilionHeight, facets]}
        position={[0, -pavilionHeight / 2, 0]}
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
  const crownBaseHeight = 0.08;
  const prongsHeight = 0.3;

  // Prongs will start from the top surface of the crown base
  const prongsBaseY = crownBaseY + crownBaseHeight / 2;
  const prongsCenterY = prongsBaseY + prongsHeight / 2;
  const gemGirdleY = prongsCenterY - 0.05; // Adjust gem girdle to sit slightly below prong center

  // Adjust prong positions to sit on the edge of the base and hold the larger gem
  // These offsets are slightly inside the scaled crown base edge for a better visual connection
  const prongXOffset = 0.38; // Slightly less than 0.5 * 0.8 = 0.4
  const prongZOffset = 0.58; // Slightly less than 0.5 * 1.2 = 0.6
  const prongPositions: [number, number, number][] = [
    [prongXOffset, prongsCenterY, prongZOffset],
    [-prongXOffset, prongsCenterY, prongZOffset],
    [prongXOffset, prongsCenterY, -prongZOffset],
    [-prongXOffset, prongsCenterY, -prongZOffset],
  ];

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

      {/* Crown Base - Scaled to match prong positions */}
      <Cylinder args={[0.5, 0.5, crownBaseHeight, 64]} position={[0, crownBaseY, 0]} scale={[0.8, 1, 1.2]}>
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </Cylinder>

      {/* Four-Prong Setting */}
      {prongPositions.map((pos, i) => (
        <Cylinder key={i} args={[0.04, 0.04, prongsHeight, 16]} position={pos}>
           <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </Cylinder>
      ))}
      
      {/* Gemstone - Oval cut style */}
      {selectedGem && (
        <group position={[0, gemPositionY, 0]}>
          <OvalCutGem color={selectedGem.color} />
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