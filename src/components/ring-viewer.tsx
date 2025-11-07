"use client";

import { Torus, Cylinder } from "@react-three/drei";
import { useCustomizer } from "@/context/customizer-context";
import { OvalCutGem } from "./gem-model";

export function Ring() {
  const { selectedGem } = useCustomizer();

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
      <Torus args={[1, 0.06, 32, 100]} rotation={[Math.PI / 2, Math.PI / 2, 0]} scale={[1, 1, 1.5]}>
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </Torus>
      <group rotation-y={Math.PI / 2}>
        <Cylinder args={[crownBaseRadius, crownBaseRadius, crownBaseHeight, 64]} position={[0, crownBaseY, 0]} scale={[crownBaseScaleX, 1, crownBaseScaleZ]}>
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </Cylinder>
        <Cylinder args={[crownBaseRadius, crownBaseRadius, wallHeight, 64]} position={[0, wallCenterY, 0]} scale={[crownBaseScaleX, 1, crownBaseScaleZ]}>
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