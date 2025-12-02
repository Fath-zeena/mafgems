"use client";

import { Cylinder } from "@react-three/drei";

export function OvalCutGem({ color, gemName, scale = 1 }: { color: string; gemName?: string; scale?: number }) {
  let materialProps: any = {
    color: color,
    roughness: 0,
    transmission: 1,
    thickness: 2,
    ior: 2.417,
    reflectivity: 1,
  };

  if (gemName === "Diamond") {
    materialProps = { ...materialProps, color: "#F0F0F0", roughness: 0.1, transmission: 0.9, clearcoat: 0.5, clearcoatRoughness: 0.1 };
  } else if (gemName === "Alexandrite") {
    materialProps = { ...materialProps, color: "#6A0DAD", clearcoat: 1, clearcoatRoughness: 0.1, sheen: 1, sheenColor: "#00CED1", transmission: 0.8 };
  }

  const girdleRadius = 0.55 * scale;
  const crownHeight = 0.1 * scale;
  const pavilionHeight = 0.25 * scale;
  const facets = 16;

  return (
    <group rotation={[Math.PI, 0, 0]} scale={[0.8, 1.2, 1]}>
      {/* Explicitly passing material as a prop instead of a child to avoid potential R3F issues */}
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

export function RoundCutGem({ color, gemName, scale = 1 }: { color: string; gemName?: string; scale?: number }) {
  let materialProps: any = {
    color: color,
    roughness: 0,
    transmission: 1,
    thickness: 2,
    ior: 2.417,
    reflectivity: 1,
  };

  if (gemName === "Diamond") {
    materialProps = { ...materialProps, color: "#F0F0F0", roughness: 0.1, transmission: 0.9, clearcoat: 0.5, clearcoatRoughness: 0.1 };
  }

  const radius = 0.2 * scale;
  const height = 0.15 * scale;
  const facets = 12;

  return (
    <group rotation={[Math.PI, 0, 0]}>
      <Cylinder 
        args={[radius, radius, height * 0.3, facets]} 
        position={[0, height * 0.15, 0]}
      >
        <meshPhysicalMaterial {...materialProps} />
      </Cylinder>
      
      <Cylinder 
        args={[radius, 0, height * 0.7, facets]} 
        position={[0, -height * 0.35, 0]}
      >
        <meshPhysicalMaterial {...materialProps} />
      </Cylinder>
    </group>
  );
}