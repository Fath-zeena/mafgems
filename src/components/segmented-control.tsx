"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SegmentedControlProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}

export function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  return (
    <div className="inline-flex items-center justify-center p-1 rounded-lg bg-muted">
      {options.map((option) => (
        <Button
          key={option.value}
          variant="ghost"
          className={cn(
            "px-4 py-1.5 text-sm font-medium",
            value === option.value ? "bg-background shadow-sm" : "hover:bg-muted/50"
          )}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}