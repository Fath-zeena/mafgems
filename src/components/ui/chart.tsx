"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/lib/utils";

type AnyObject = { [key: string]: any };

// A small, permissive type for our Legend wrapper so `payload` is allowed and typed as any.
type LegendWrapperProps = React.ComponentProps<"div"> & {
  payload?: any;
  verticalAlign?: any;
  hideIcon?: boolean;
  nameKey?: string;
  valueKey?: string;
  label?: string;
  labelFormatter?: ((value: any) => string) | undefined;
};

export function CustomLegend({
  payload,
  verticalAlign,
  hideIcon = false,
  nameKey,
  label,
  labelFormatter,
  className,
  ...props
}: LegendWrapperProps) {
  // Ensure payload is treated as an array for runtime checks
  const items: any[] = Array.isArray(payload) ? payload : [];

  if (!items?.length) {
    return null;
  }

  return (
    <div className={cn("grid gap-1.5", className)} {...props}>
      {items.map((item: any, index: number) => {
        const key = `${nameKey || item.name || item.dataKey || "value"}-${index}`;
        const labelText = label || (item && (item.name || item.dataKey)) || "";
        const formattedLabel = labelFormatter ? labelFormatter(labelText) : labelText;
        return (
          <div key={key} className="flex items-center space-x-2">
            {!hideIcon && <span className="w-3 h-3 rounded-full" style={{ background: item.color }} />}
            <div className="text-sm text-gray-700">{formattedLabel}</div>
          </div>
        );
      })}
    </div>
  );
}

// Example tooltip/legend usage further down in the file, ensure map callbacks have explicit types
export function LegendContent({ payload }: { payload?: any }) {
  const items: any[] = Array.isArray(payload) ? payload : [];

  if (!items.length) return null;

  return (
    <div className="grid gap-1.5">
      {items.map((item: any, index: number) => {
        const key = `${item.dataKey || item.name || "value"}-${index}`;
        return (
          <div key={key} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-sm" style={{ background: item.color }} />
            <div className="text-sm text-gray-700">{item.payload?.value ?? item.value ?? "-"}</div>
          </div>
        );
      })}
    </div>
  );
}

export default CustomLegend;