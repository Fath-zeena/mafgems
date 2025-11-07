"use client";

import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Torus, Cylinder } from "@react-three/drei";
import { useCustomizer } from "@/context/customizer-context";
import { OvalCutGem } from "./gem-model";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as THREE from 'three';

// Ring model, now defined locally within the unified viewer
function Ring() {
  const { selectedGem } = useCustomizer();
  return (
    <group position-y={0.11}>
      <Torus args={[1, 0.06, 32, 100]} rotation={[Math.PI / 2, Math.PI / 2, 0]} scale={[1, 1, 1.5]}>
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </Torus>
      <group rotation-y={Math.PI / 2}>
        <Cylinder args={[0.6, 0.6, 0.08, 64]} position={[0, 1.1, 0]} scale={[0.8, 1, 1.2]}>
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </Cylinder>
        <Cylinder args={[0.6, 0.6, 0.05, 64]} position={[0, 1.1 + 0.08 / 2 + 0.05 / 2, 0]} scale={[0.8, 1, 1.2]}>
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </Cylinder>
        {selectedGem && (
          <group position={[0, 1.1 + 0.08 / 2 + 0.05, 0]}>
            <OvalCutGem color={selectedGem.color} gemName={selectedGem.name} />
          </group>
        )}
      </group>
    </group>
  );
}

// Necklace model, now defined locally within the unified viewer
function Necklace() {
  const { selectedGem } = useCustomizer();
  return (
    <group>
      <Torus args={[2.5, 0.03, 32, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </Torus>
      <group position={[0, -2.5, 0]}>
        <Cylinder args={[0.6, 0.6, 0.08, 64]} position={[0, 0, 0]} scale={[0.8, 1, 1.2]}>
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </Cylinder>
        <Cylinder args={[0.6, 0.6, 0.05, 64]} position={[0, 0.08 / 2 + 0.05 / 2, 0]} scale={[0.8, 1, 1.2]}>
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </Cylinder>
        {selectedGem && (
          <group position={[0, 0.08 / 2 + 0.05, 0]}>
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
    <div className="w-full h-full flex flex-col" onDrop={handleDrop} onDragOver={handleDragOver}>
      <Tabs defaultValue="ring" onValueChange={setView} className="flex-shrink-0">
        <TabsList className="mx-auto mt-2">
          <TabsTrigger value="ring">Ring</TabsTrigger>
          <TabsTrigger value="necklace">Necklace</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex-grow w-full h-full">
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
    </div>
  );
}