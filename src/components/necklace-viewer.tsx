"use client";

import { Torus, Cylinder } from "@react-three/drei";
import { useCustomizer } from "@/context/customizer-context";
import { OvalCutGem } from "./gem-model";

export function Necklace() {
  const { selectedGem } = useCustomizer();

  const pendantBaseY = 0;
  const pendantBaseHeight = 0.08;
  const wallHeight = 0.05;

  const wallBaseY = pendantBaseY + pendantBaseHeight / 2;
  const wallCenterY = wallBaseY + wallHeight / 2;
  const gemGirdleY = wallCenterY + wallHeight / 2;

  const pendantBaseRadius = 0.6;
  const pendantBaseScaleX = 0.8;
  const pendantBaseScaleZ = 1.2;

  const gemPositionY = gemGirdleY;

  return (
    <group>
      <Torus args={[2.5, 0.03, 32, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </Torus>
      <group position={[0, -2.5, 0]}>
        <Cylinder args={[pendantBaseRadius, pendantBaseRadius, pendantBaseHeight, 64]} position={[0, pendantBaseY, 0]} scale={[pendantBaseScaleX, 1, pendantBaseScaleZ]}>
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </Cylinder>
        <Cylinder args={[pendantBaseRadius, pendantBaseRadius, wallHeight, 64]} position={[0, wallCenterY, 0]} scale={[pendantBaseScaleX, 1, pendantBaseScaleZ]}>
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
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