"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { Gem } from "@/types";

export type MetalType = "yellow_gold" | "white_gold" | "rose_gold" | "platinum" | "silver";

interface CustomizerContextType {
  selectedGem: Gem | null;
  setSelectedGem: (gem: Gem | null) => void;
  metalColor: MetalType;
  setMetalColor: (metal: MetalType) => void;
}

const CustomizerContext = createContext<CustomizerContextType | undefined>(
  undefined
);

export function CustomizerProvider({ children }: { children: ReactNode }) {
  const [selectedGem, setSelectedGem] = useState<Gem | null>(null);
  const [metalColor, setMetalColor] = useState<MetalType>("yellow_gold");

  return (
    <CustomizerContext.Provider value={{ selectedGem, setSelectedGem, metalColor, setMetalColor }}>
      {children}
    </CustomizerContext.Provider>
  );
}

export function useCustomizer() {
  const context = useContext(CustomizerContext);
  if (context === undefined) {
    throw new Error("useCustomizer must be used within a CustomizerProvider");
  }
  return context;
}