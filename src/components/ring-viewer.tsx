"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Torus, Cylinder } from "@react-three/drei";
import { useCustomizer } from "@/context/customizer-context";

// A custom component to create an oval cut gem shape with a dome top and facets
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
  const facets = 16; // Increased facets for a more multifaced look

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

  const crownBaseY = 1.1;
  const crownBaseHeight = 0.08;
  const wallHeight = 0.05; // Current wall height

  // Position calculations for the setting
  const wallBaseY = crownBaseY + crownBaseHeight / 2;
  const wallCenterY = wallBaseY + wallHeight / 2; // Center Y for the wall
  
  // Adjust gemGirdleY to place the gem's girdle at the top of the wall
  const gemGirdleY = wallCenterY + wallHeight / 2; 

  // Crown Base dimensions (radius * scale)
  const crownBaseRadius = 0.6;
  const crownBaseScaleX = 0.8;
  const crownBaseScaleZ = 1.2;

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

      {/* Crown Base */}
      <Cylinder args={[crownBaseRadius, crownBaseRadius, crownBaseHeight, 64]} position={[0, crownBaseY, 0]} scale={[crownBaseScaleX, 1, crownBaseScaleZ]}>
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </Cylinder>

      {/* Continuous Wall Setting */}
      <Cylinder 
        args={[crownBaseRadius, crownBaseRadius, wallHeight, 64]} // Use crownBaseRadius for the wall's radius
        position={[0, wallCenterY, 0]} // Position on top of the crown base
        scale={[crownBaseScaleX, 1, crownBaseScaleZ]} // Match the oval shape of the crown base
      >
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </Cylinder>
      
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
        {/* Adjusted spotLight for a more realistic, less washed-out top view */}
        <spotLight position={[0, 5, 0]} angle={0.5} penumbra={0.8} decay={0} intensity={Math.PI / 2} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        
        <Ring />

        <OrbitControls target={[0, 0.75, 0]} />
      </Canvas>
    </div>
  );
}