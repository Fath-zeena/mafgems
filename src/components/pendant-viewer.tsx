"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Torus, Cylinder, Sphere } from "@react-three/drei";
import { useCustomizer } from "@/context/customizer-context";

// The OvalCutGem component is defined inside this file.
function OvalCutGem({ color, gemName }: { color: string; gemName?: string }) {
  let materialProps: any = { color, roughness: 0, transmission: 1, thickness: 2, ior: 2.417, reflectivity: 1 };
  if (gemName === "Diamond") materialProps = { ...materialProps, color: "#F0F0F0", roughness: 0.1, transmission: 0.9, clearcoat: 0.5, clearcoatRoughness: 0.1 };
  if (gemName === "Alexandrite") materialProps = { ...materialProps, color: "#6A0DAD", clearcoat: 1, clearcoatRoughness: 0.1, sheen: 1, sheenColor: "#00CED1", transmission: 0.8 };
  
  return (
    <group rotation={[Math.PI, 0, 0]} scale={[0.8, 1.2, 1]}>
      <Cylinder args={[0.55, 0.55, 0.1, 16]} position={[0, 0.05, 0]}>
        <meshPhysicalMaterial {...materialProps} />
      </Cylinder>
      <Cylinder args={[0.55, 0.22, 0.25, 16]} position={[0, -0.125, 0]}>
        <meshPhysicalMaterial {...materialProps} />
      </Cylinder>
    </group>
  );
}

// Helper for decorative sphere clusters
function GranulationCluster({ scale = 1 }: { scale?: number }) {
  const sphereRadius = 0.03 * scale;
  const offset = 0.04 * scale;
  return (
    <group>
      <Sphere args={[sphereRadius, 16, 16]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#B76E79" metalness={0.8} roughness={0.2} />
      </Sphere>
      <Sphere args={[sphereRadius, 16, 16]} position={[offset, 0, 0]}>
        <meshStandardMaterial color="#B76E79" metalness={0.8} roughness={0.2} />
      </Sphere>
      <Sphere args={[sphereRadius, 16, 16]} position={[-offset, 0, 0]}>
        <meshStandardMaterial color="#B76E79" metalness={0.8} roughness={0.2} />
      </Sphere>
      <Sphere args={[sphereRadius, 16, 16]} position={[0, offset, 0]}>
        <meshStandardMaterial color="#B76E79" metalness={0.8} roughness={0.2} />
      </Sphere>
      <Sphere args={[sphereRadius, 16, 16]} position={[0, -offset, 0]}>
        <meshStandardMaterial color="#B76E79" metalness={0.8} roughness={0.2} />
      </Sphere>
    </group>
  );
}

// The main Pendant component with the new design
function Pendant() {
  const { selectedGem } = useCustomizer();

  return (
    <group>
      {/* Bail (connector) */}
      <group position={[0, 0.9, 0]}>
        <Torus args={[0.15, 0.02, 16, 32]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.2, 0]}>
          <meshStandardMaterial color="#B76E79" metalness={0.8} roughness={0.2} />
        </Torus>
        <group position={[0, 0.05, 0]}>
          <GranulationCluster scale={0.8} />
        </group>
      </group>

      {/* Main Pendant */}
      <group scale={[0.8, 1.2, 1]}>
        <Torus args={[0.7, 0.03, 16, 16]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#B76E79" metalness={0.8} roughness={0.2} />
        </Torus>
        <Torus args={[0.6, 0.04, 16, 64]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#B76E79" metalness={0.8} roughness={0.2} />
        </Torus>
        <Cylinder args={[0.55, 0.55, 0.1, 64]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#B76E79" metalness={0.8} roughness={0.2} />
        </Cylinder>
        <group position={[0.5, 0, 0]} rotation={[0, 0, -Math.PI / 12]}><GranulationCluster /></group>
        <group position={[-0.5, 0, 0]} rotation={[0, 0, Math.PI / 12]}><GranulationCluster /></group>
        <group position={[0, 0, 0.65]} rotation={[Math.PI / 12, 0, 0]}><GranulationCluster /></group>
        <group position={[0, 0, -0.65]} rotation={[-Math.PI / 12, 0, 0]}><GranulationCluster /></group>
      </group>

      {selectedGem && <group position-y={0.05}><OvalCutGem color={selectedGem.color} gemName={selectedGem.name} /></group>}
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
        setSelectedGem(JSON.parse(gemDataString));
      } catch (error) {
        console.error("Failed to parse dropped gem data:", error);
      }
    }
  };

  return (
    <div
      className="w-full h-full bg-gray-200 dark:bg-gray-950"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={Math.PI * 0.5} />
        <spotLight position={[5, 5, 5]} angle={0.7} penumbra={1} decay={0} intensity={Math.PI} />
        <spotLight position={[-5, 5, 5]} angle={0.7} penumbra={1} decay={0} intensity={Math.PI} />
        <Pendant />
        <OrbitControls target={[0, 0, 0]} />
      </Canvas>
    </div>
  );
}