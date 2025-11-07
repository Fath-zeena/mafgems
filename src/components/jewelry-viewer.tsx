"use client";

import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useCustomizer } from "@/context/customizer-context";
import { SegmentedControl } from "./segmented-control";
import { Ring } from "./ring-viewer";
import { Necklace } from "./necklace-viewer";
import * as THREE from 'three';

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