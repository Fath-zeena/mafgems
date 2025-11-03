"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Torus, Cylinder, Box } from "@react-three/drei"; // Added Box
import { useCustomizer } from "@/context/customizer-context";

// A custom component to create an emerald cut gem shape with step facets
function EmeraldCutGem({ color }: { color: string }) {
  const materialProps = {
    color: color,
    roughness: 0,
    transmission: 1,
    thickness: 2,
    ior: 2.417, // Precise Index of Refraction for diamond
    reflectivity: 1,
  };

  const baseWidth = 0.8;
  const baseDepth = 0.6;
  const totalHeight = 0.6; // Overall height of the gem

  // Define heights for different sections
  const tableHeight = 0.05;
  const crownStepHeight = 0.08;
  const pavilionStepHeight = 0.12;
  const culetHeight = 0.1; // Height of the very bottom tip

  // Calculate Y positions for each step, relative to the gem's center (0)
  // Crown (top part)
  const crownTopY = totalHeight / 2; // Topmost point of the gem
  const tableCenterY = crownTopY - tableHeight / 2;
  const crownStep1CenterY = tableCenterY - tableHeight / 2 - crownStepHeight / 2;
  const crownStep2CenterY = crownStep1CenterY - crownStepHeight / 2 - crownStepHeight / 2; // Girdle level

  // Pavilion (bottom part)
  const pavilionTopY = crownStep2CenterY - crownStepHeight / 2; // Top of pavilion, same as bottom of girdle
  const pavilionStep1CenterY = pavilionTopY - pavilionStepHeight / 2;
  const pavilionStep2CenterY = pavilionStep1CenterY - pavilionStepHeight / 2 - pavilionStepHeight / 2;
  const culetCenterY = pavilionStep2CenterY - pavilionStepHeight / 2 - culetHeight / 2;

  return (
    <group> {/* No rotation here, table should be up */}
      {/* Table (top flat surface) */}
      <Box args={[baseWidth * 0.6, tableHeight, baseDepth * 0.6]} position={[0, tableCenterY, 0]}>
        <meshPhysicalMaterial {...materialProps} />
      </Box>

      {/* Crown Step 1 */}
      <Box args={[baseWidth * 0.7, crownStepHeight, baseDepth * 0.7]} position={[0, crownStep1CenterY, 0]}>
        <meshPhysicalMaterial {...materialProps} />
      </Box>

      {/* Crown Step 2 (Girdle) */}
      <Box args={[baseWidth * 0.8, crownStepHeight, baseDepth * 0.8]} position={[0, crownStep2CenterY, 0]}>
        <meshPhysicalMaterial {...materialProps} />
      </Box>

      {/* Pavilion Step 1 */}
      <Box args={[baseWidth * 0.7, pavilionStepHeight, baseDepth * 0.7]} position={[0, pavilionStep1CenterY, 0]}>
        <meshPhysicalMaterial {...materialProps} />
      </Box>

      {/* Pavilion Step 2 */}
      <Box args={[baseWidth * 0.6, pavilionStepHeight, baseDepth * 0.6]} position={[0, pavilionStep2CenterY, 0]}>
        <meshPhysicalMaterial {...materialProps} />
      </Box>

      {/* Culet (bottom tip) */}
      <Box args={[baseWidth * 0.4, culetHeight, baseDepth * 0.4]} position={[0, culetCenterY, 0]}>
        <meshPhysicalMaterial {...materialProps} />
      </Box>
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
  // The girdle of the EmeraldCutGem is at Y = 0.13 in its local coordinates
  const gemGirdleLocalY = 0.13; 
  const gemPositionY = (wallCenterY + wallHeight / 2) - gemGirdleLocalY;

  // Crown Base dimensions (radius * scale)
  const crownBaseRadius = 0.6;
  const crownBaseScaleX = 0.8;
  const crownBaseScaleZ = 1.2;

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
      
      {/* Gemstone - Emerald cut style */}
      {selectedGem && (
        <group position={[0, gemPositionY, 0]}>
          <EmeraldCutGem color={selectedGem.color} />
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
        {/* Adjusted spotLight for a softer, more spread-out light */}
        <spotLight position={[0, 6, 0]} angle={0.7} penumbra={1} decay={0} intensity={Math.PI / 3} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        
        <Ring />

        <OrbitControls target={[0, 0.75, 0]} />
      </Canvas>
    </div>
  );
}