"use client";

import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Torus, Cylinder } from "@react-three/drei";
import { useCustomizer } from "@/context/customizer-context";
import { SegmentedControl } from "./segmented-control";
import { OvalCutGem } from "./gem-model";
import * as THREE from 'three';

// Ring model, now defined locally within the viewer component
function Ring() {
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

// Necklace model, now defined locally within the viewer component
function Necklace() {
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

export function JewelryViewer() {
  const { setSelectedGem } = useCustomizer();
  const [view, setView] = useState("ring");
  const orbitControlsRef = useRef<any>(null);

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
    e.preventDefault();
  };

  useEffect(() => {
    if (orbitControlsRef.current) {
      const target = view === "ring" ? new THREE.Vector3(0, 0.75, 0) : new THREE.Vector3(0, -1, 0);
      orbitControlsRef.current.target.copy(target);
      orbitControlsRef.current.update();
    }
  }, [view]);

  return (
    <div className="w-full h-full relative" onDrop={handleDrop} onDragOver={handleDragOver}>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <SegmentedControl
          options={[
            { label: "Ring", value: "ring" },
            { label: "Necklace", value: "necklace" },
          ]}
          value={view}
          onChange={setView}
        />
      </div>
      <Canvas camera={{ position: [3, 2, 3], fov: 45 }}>
        <ambientLight intensity={Math.PI} />
        <spotLight position={[3, 5, 3]} angle={0.7} penumbra={1} decay={0} intensity={Math.PI / 3} />
        <spotLight position={[0, 2, 0]} angle={0.3} penumbra={0.5} decay={0} intensity={Math.PI / 2} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        
        <group visible={view === 'ring'}>
          <Ring />
        </group>
        <group visible={view === 'necklace'}>
          <Necklace />
        </group>
        
        <OrbitControls ref={orbitControlsRef} target={[0, 0.75, 0]} />
      </Canvas>
    </div>
  );
}