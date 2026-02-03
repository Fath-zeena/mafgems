"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Cylinder } from "@react-three/drei";
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
      metalness: 0.8,
      roughness: 0.2,
    },
    white_gold: {
      color: "#F5F5F5",
      metalness: 0.85,
      roughness: 0.15,
    },
    rose_gold: {
      color: "#B76E79",
      metalness: 0.8,
      roughness: 0.2,
    },
    platinum: {
      color: "#E8E8E8",
      metalness: 0.9,
      roughness: 0.1,
    },
    silver: {
      color: "#C0C0C0",
      metalness: 0.75,
      roughness: 0.25,
    },
  };

  const metalMaterial = metalColorMap[metalColor] || metalColorMap.white_gold;

  const ringRadius = 1;
  const bandWidth = 0.15;
  const bandHeight = 0.08;

  const baseRadius = ringRadius - bandWidth / 2;
  const crownBaseRadius = baseRadius;
  const crownBaseScaleX = 1;
  const crownBaseScaleZ = 1.3;
  const crownHeight = 0.3;
  const crownBaseScaleY = 1;
  const wallHeight = bandHeight;
  const wallCenterY = 0;
  const gemPositionY = crownHeight / 2 + 0.05;

  return (
    <group>
      <group>
        <Cylinder
          args={[baseRadius, baseRadius, bandHeight, 64]}
          position={[0, wallCenterY, 0]}
        >
          <meshStandardMaterial
            color={metalMaterial.color}
            metalness={metalMaterial.metalness}
            roughness={metalMaterial.roughness}
          />
        </Cylinder>
        <Cylinder
          args={[crownBaseRadius, crownBaseRadius, wallHeight, 64]}
          position={[0, wallCenterY, 0]}
          scale={[crownBaseScaleX, 1, crownBaseScaleZ]}
        >
          <meshStandardMaterial
            color={metalMaterial.color}
            metalness={metalMaterial.metalness}
            roughness={metalMaterial.roughness}
          />
        </Cylinder>
        {selectedGem && (
          <group position={[0, gemPositionY, 0]}>
            <OvalCutGem color={selectedGem.color} gemName={selectedGem.name} />
          </group>
        )}
      </group>
    </group>
  );
}

export const RingViewerCanvas = memo(function RingViewerCanvasComponent() {
  const { setSelectedGem } = useCustomizer();

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
      <Canvas camera={{ position: [3, 2, 3], fov: 45 }}>
        <ambientLight intensity={Math.PI} />
        <spotLight
          position={[3, 5, 3]}
          angle={0.7}
          penumbra={1}
          decay={0}
          intensity={Math.PI / 3}
        />
        <spotLight
          position={[0, 2, 0]}
          angle={0.3}
          penumbra={0.5}
          decay={0}
          intensity={Math.PI / 2}
        />
        <pointLight
          position={[-10, -10, -10]}
          decay={0}
          intensity={Math.PI}
        />
        <Ring />
        <OrbitControls target={[0, 0.75, 0]} />
      </Canvas>
    </div>
  );
});
