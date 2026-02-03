"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Cylinder, Torus, Environment, ContactShadows, Center } from "@react-three/drei";
import { useCustomizer } from "@/context/customizer-context";
import { memo } from "react";

// Self-contained OvalCutGem with material logic for different gem types
function OvalCutGem({ color, gemName }: { color: string; gemName?: string }) {
  let materialProps: any = {
    color,
    roughness: 0,
    transmission: 1,
    thickness: 2,
    ior: 2.417,
    reflectivity: 1,
  };

  // Gem-specific rendering properties
  if (gemName === "Diamond") {
    materialProps = {
      color: "#F0F0F0",
      roughness: 0.05,
      transmission: 1,
      thickness: 3,
      ior: 2.417,
      clearcoat: 1,
      clearcoatRoughness: 0,
      sheen: 0,
    };
  } else if (gemName === "Ruby") {
    materialProps = {
      color: "#E0115F",
      roughness: 0.15,
      transmission: 0.9,
      thickness: 1.5,
      ior: 1.762,
      clearcoat: 0.8,
      sheen: 1,
      sheenColor: "#FF0000",
    };
  } else if (gemName === "Sapphire") {
    materialProps = {
      color: "#0F52BA",
      roughness: 0.12,
      transmission: 0.95,
      thickness: 2,
      ior: 1.762,
      clearcoat: 0.9,
      sheenColor: "#1E90FF",
    };
  } else if (gemName === "Emerald") {
    materialProps = {
      color: "#50C878",
      roughness: 0.2,
      transmission: 0.85,
      thickness: 1.8,
      ior: 1.576,
      clearcoat: 0.6,
    };
  } else if (gemName === "Amethyst") {
    materialProps = {
      color: "#9966CC",
      roughness: 0.18,
      transmission: 0.88,
      thickness: 1.9,
      ior: 1.544,
      clearcoat: 0.7,
      sheen: 0.2,
    };
  } else if (gemName === "Topaz") {
    materialProps = {
      color: "#FFC200",
      roughness: 0.16,
      transmission: 0.9,
      thickness: 1.7,
      ior: 1.609,
      clearcoat: 0.8,
    };
  } else if (gemName === "Pearl") {
    materialProps = {
      color: "#F0E68C",
      roughness: 0.3,
      transmission: 0.4,
      thickness: 0.5,
      ior: 1.33,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
    };
  } else if (gemName === "Opal") {
    materialProps = {
      color: "#9BB0FF",
      roughness: 0.2,
      transmission: 0.6,
      thickness: 1.2,
      ior: 1.45,
      iridescence: 1,
      iridescenceIOR: 1.3,
      sheen: 0.5,
    };
  } else if (gemName === "Alexandrite") {
    materialProps = {
      color: "#370417",
      roughness: 0.13,
      transmission: 0.92,
      thickness: 2.1,
      ior: 1.746,
      clearcoat: 0.85,
      sheen: 0.4,
    };
  } else if (gemName === "Aquamarine") {
    materialProps = {
      color: "#00FFFF",
      roughness: 0.14,
      transmission: 0.93,
      thickness: 2,
      ior: 1.577,
      clearcoat: 0.88,
      sheen: 0.2,
    };
  } else if (gemName === "Garnet") {
    materialProps = {
      color: "#1C0C06",
      roughness: 0.11,
      transmission: 0.95,
      thickness: 2.2,
      ior: 1.74,
      clearcoat: 0.9,
      sheen: 0.3,
    };
  } else if (gemName === "Citrine") {
    materialProps = {
      color: "#E06377",
      roughness: 0.15,
      transmission: 0.91,
      thickness: 1.9,
      ior: 1.532,
      clearcoat: 0.82,
      sheen: 0.25,
    };
  } else if (gemName === "Morganite") {
    materialProps = {
      color: "#F64A8A",
      roughness: 0.16,
      transmission: 0.89,
      thickness: 1.8,
      ior: 1.58,
      clearcoat: 0.8,
      sheen: 0.5,
      sheenColor: "#FFB6C1",
    };
  } else if (gemName === "Tanzanite") {
    materialProps = {
      color: "#0047AB",
      roughness: 0.14,
      transmission: 0.92,
      thickness: 2,
      ior: 1.69,
      clearcoat: 0.85,
      sheen: 0.4,
    };
  } else if (gemName === "Peridot") {
    materialProps = {
      color: "#E8FF00",
      roughness: 0.17,
      transmission: 0.90,
      thickness: 1.8,
      ior: 1.654,
      clearcoat: 0.7,
      sheen: 0.3,
    };
  }

  const girdleRadius = 0.55;
  const crownHeight = 0.1;
  const pavilionHeight = 0.25;
  const facets = 16;

  return (
    <group rotation={[Math.PI, 0, 0]} scale={[0.8, 1, 1.2]}>
      <Cylinder
        args={[girdleRadius, girdleRadius, crownHeight, facets]}
        position={[0, crownHeight / 2, 0]}
      >
        <meshPhysicalMaterial {...materialProps} />
      </Cylinder>
      <Cylinder
        args={[girdleRadius, girdleRadius * 0.4, pavilionHeight, facets]}
        position={[0, -pavilionHeight / 2, 0]}
      >
        <meshPhysicalMaterial {...materialProps} />
      </Cylinder>
    </group>
  );
}

// Ring model
function Ring() {
  const { selectedGem, metalColor } = useCustomizer();

  const metalColorMap: Record<string, any> = {
    yellow_gold: {
      color: "#FFD700",
      metalness: 0.9,
      roughness: 0.1,
    },
    white_gold: {
      color: "#F9F9F9",
      metalness: 0.95,
      roughness: 0.1,
    },
    rose_gold: {
      color: "#B76E79",
      metalness: 0.9,
      roughness: 0.1,
    },
    platinum: {
      color: "#E5E4E2",
      metalness: 0.95,
      roughness: 0.05,
    },
    silver: {
      color: "#C0C0C0",
      metalness: 0.8,
      roughness: 0.2,
    },
  };

  const metalMaterial = metalColorMap[metalColor] || metalColorMap.white_gold;

  return (
    <group>
      <group>
        {/* Ring Band: Torus Geometry */}
        <Torus args={[1, 0.1, 64, 100]}>
          <meshStandardMaterial
            color={metalMaterial.color}
            metalness={metalMaterial.metalness}
            roughness={metalMaterial.roughness}
            envMapIntensity={1}
          />
        </Torus>
      </group>

      {/* Gem Setting - Scaled Up and position adjusted */}
      <group position={[0, 1.45, 0]} scale={[1.5, 1.5, 1.5]}>
        {/* Bezel/Prongs base - Oval Shape - Height Reduced - Base Slightly Larger */}
        <Cylinder args={[0.365, 0.2, 0.2, 32]} position={[0, -0.3, 0]} scale={[0.8, 1, 1.2]}>
          <meshStandardMaterial
            color={metalMaterial.color}
            metalness={metalMaterial.metalness}
            roughness={metalMaterial.roughness}
            envMapIntensity={1}
          />
        </Cylinder>
        
        {/* The Gem - Lowered further to close gap */}
        {selectedGem && (
          <group position={[0, -0.19, 0]} scale={[0.62, 0.62, 0.62]}>
            <OvalCutGem color={selectedGem.color} gemName={selectedGem.name} />
          </group>
        )}
      </group>
    </group>
  );
}

export const RingViewerCanvas = memo(function RingViewerCanvasComponent() {
  const { setSelectedGem } = useCustomizer();

  // Safety guard: never render during SSR
  if (typeof window === "undefined") {
    return null;
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const gemDataString = e.dataTransfer.getData("application/json");
    if (!gemDataString) return;
    try {
      const gem = JSON.parse(gemDataString);
      setSelectedGem(gem);
    } catch (error) {
      console.error("Failed to parse dropped gem data:", error);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div
      className="w-full h-full bg-gray-200 dark:bg-gray-950"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Canvas shadows camera={{ position: [4, 4, 4], fov: 45 }}>
        <Environment preset="city" />
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
          castShadow
        />
        <Center position={[0, 0, 0]}>
          <Ring />
        </Center>
        <ContactShadows resolution={1024} scale={10} blur={2} opacity={0.5} far={10} color="#333" />
        <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.8} />
      </Canvas>
    </div>
  );
});
