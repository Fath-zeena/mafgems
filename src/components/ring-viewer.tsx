"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Torus, Cylinder } from "@react-three/drei";
import { useCustomizer } from "@/context/customizer-context";
import { useEffect, useState } from "react";

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
      thickness: 1.6,
      ior: 1.544,
      clearcoat: 0.7,
    };
  } else if (gemName === "Topaz") {
    materialProps = {
      color: "#FFC87C",
      roughness: 0.16,
      transmission: 0.92,
      thickness: 1.7,
      ior: 1.609,
      clearcoat: 0.8,
      sheen: 0.5,
    };
  } else if (gemName === "Pearl") {
    materialProps = {
      color: "#F0F0F0",
      roughness: 0.3,
      transmission: 0.2,
      thickness: 0.5,
      ior: 1.33,
      clearcoat: 0.5,
      sheen: 1,
      sheenColor: "#FFE4B5",
    };
  } else if (gemName === "Opal") {
    materialProps = {
      color: "#A9A9A9",
      roughness: 0.25,
      transmission: 0.5,
      thickness: 1,
      ior: 1.45,
      clearcoat: 0.4,
      iridescence: 0.5,
    };
  } else if (gemName === "Alexandrite") {
    materialProps = {
      color: "#6A0DAD",
      roughness: 0.14,
      transmission: 0.9,
      thickness: 1.8,
      ior: 1.746,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      sheen: 1,
      sheenColor: "#00CED1",
    };
  } else if (gemName === "Aquamarine") {
    materialProps = {
      color: "#7FFFD4",
      roughness: 0.13,
      transmission: 0.93,
      thickness: 2.1,
      ior: 1.577,
      clearcoat: 0.85,
      sheen: 0.3,
    };
  } else if (gemName === "Garnet") {
    materialProps = {
      color: "#922B3E",
      roughness: 0.17,
      transmission: 0.87,
      thickness: 1.5,
      ior: 1.79,
      clearcoat: 0.75,
      sheen: 0.8,
    };
  } else if (gemName === "Citrine") {
    materialProps = {
      color: "#E06377",
      roughness: 0.16,
      transmission: 0.91,
      thickness: 1.9,
      ior: 1.544,
      clearcoat: 0.8,
      sheen: 0.4,
    };
  } else if (gemName === "Morganite") {
    materialProps = {
      color: "#FF99CC",
      roughness: 0.15,
      transmission: 0.89,
      thickness: 1.7,
      ior: 1.58,
      clearcoat: 0.75,
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

  // Metal color mapping
  const metalColorMap: { [key: string]: { color: string; metalness: number; roughness: number } } = {
    yellow_gold: { color: "#FFD700", metalness: 0.8, roughness: 0.2 },
    white_gold: { color: "#F5F5F5", metalness: 0.85, roughness: 0.15 },
    rose_gold: { color: "#F8B4D6", metalness: 0.8, roughness: 0.2 },
    platinum: { color: "#E8E8E8", metalness: 0.9, roughness: 0.1 },
    silver: { color: "#C0C0C0", metalness: 0.85, roughness: 0.2 },
  };

  const metalMaterial = metalColorMap[metalColor];

  const crownBaseY = 1.1;
  const crownBaseHeight = 0.08;
  const wallHeight = 0.05;

  const wallBaseY = crownBaseY + crownBaseHeight / 2;
  const wallCenterY = wallBaseY + wallHeight / 2;
  const gemGirdleY = wallCenterY + wallHeight / 2;

  const crownBaseRadius = 0.6;
  const crownBaseScaleX = 0.8;
  const crownBaseScaleZ = 1.2;

  const gemPositionY = gemGirdleY;

  return (
    <group position-y={0.11}>
      {/* Band */}
      <Torus
        args={[1, 0.06, 32, 100]}
        rotation={[Math.PI / 2, Math.PI / 2, 0]}
        scale={[1, 1, 1.5]}
      >
        <meshStandardMaterial
          color={metalMaterial.color}
          metalness={metalMaterial.metalness}
          roughness={metalMaterial.roughness}
        />
      </Torus>

      {/* Crown & Gem */}
      <group rotation-y={Math.PI / 2}>
        <Cylinder
          args={[crownBaseRadius, crownBaseRadius, crownBaseHeight, 64]}
          position={[0, crownBaseY, 0]}
          scale={[crownBaseScaleX, 1, crownBaseScaleZ]}
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

export function RingViewer() {
  const { setSelectedGem } = useCustomizer();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  if (!isClient) {
    return <div className="w-full h-full bg-gray-200 dark:bg-gray-950" />;
  }

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
}