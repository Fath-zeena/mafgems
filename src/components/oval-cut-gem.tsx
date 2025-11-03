"use client";

import { Cylinder } from "@react-three/drei";

// A custom component to create an oval cut gem shape with a dome top
export function OvalCutGem({ color }: { color: string }) {
  const materialProps = {
    color: color,
    roughness: 0,
    transmission: 1,
    thickness: 2,
    ior: 2.417, // Precise Index of Refraction for diamond
    reflectivity: 1,
  };

  // Dimensions for the oval cut
  const girdleRadius = 0.5;
  const crownHeight = 0.1; // Reduced height
  const pavilionHeight = 0.2; // Reduced height for a shorter gem
  const facets = 24; // Reduced facets for a simpler look

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
      <Cylinder
        args={[girdleRadius, girdleRadius * 0.4, pavilionHeight, facets]}
        position={[0, -pavilionHeight / 2, 0]}
      >
        <meshPhysicalMaterial {...materialProps} />
      </Cylinder>
    </group>
  );
}