"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { Gem } from "@/types";

interface CustomizerContextType {
  selectedGem: Gem | null;
  setSelectedGem: (gem: Gem | null) => void;
}

const CustomizerContext = createContext<CustomizerContextType | undefined>(
  undefined
);

export function CustomizerProvider({ children }: { children: ReactNode }) {
  const [selectedGem, setSelectedGem] = useState<Gem | null>(null);

  return (
    <CustomizerContext.Provider value={{ selectedGem, setSelectedGem }}>
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