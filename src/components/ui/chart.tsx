"use client";

import React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/lib/utils";

// Minimal payload shape for legend / tooltip items
type LegendItem = {
  value?: string;
  dataKey?: string;
  color?: string;
};

// Props for our safer custom legend
type ChartLegendContentProps = React.ComponentProps<"div"> & {
  payload?: LegendItem[];
  hideIcon?: boolean;
  labelFormatter?: (value: string | undefined) => string;
};

// Props for tooltip coming from Recharts payload
type ChartTooltipContentProps = {
  active?: boolean;
  payload?: {
    name?: string;
    dataKey?: string;
    color?: string;
    value?: any;
    payload?: Record<string, any>;
  }[];
  label?: string | number;
  labelFormatter?: (value: string | number | undefined) => string | number;
};

export const ChartContainer = RechartsPrimitive.ResponsiveContainer;
export const ChartLegend = RechartsPrimitive.Legend;
export const ChartTooltip = RechartsPrimitive.Tooltip;
export const ChartArea = RechartsPrimitive.Area;
export const ChartAreaChart = RechartsPrimitive.AreaChart;
export const ChartBar = RechartsPrimitive.Bar;
export const ChartBarChart = RechartsPrimitive.BarChart;
export const ChartCartesianGrid = RechartsPrimitive.CartesianGrid;
export const ChartLine = RechartsPrimitive.Line;
export const ChartLineChart = RechartsPrimitive.LineChart;
export const ChartPie = RechartsPrimitive.Pie;
export const ChartPieChart = RechartsPrimitive.PieChart;
export const ChartRadialBar = RechartsPrimitive.RadialBar;
export const ChartRadialBarChart = RechartsPrimitive.RadialBarChart;
export const ChartScatter = RechartsPrimitive.Scatter;
export const ChartScatterChart = RechartsPrimitive.ScatterChart;
export const ChartComposedChart = RechartsPrimitive.ComposedChart;
export const ChartXAxis = RechartsPrimitive.XAxis;
export const ChartYAxis = RechartsPrimitive.YAxis;

// Custom Legend Content
export function ChartLegendContent({
  payload,
  hideIcon = false,
  labelFormatter,
  className,
  ...props
}: ChartLegendContentProps) {
  if (!payload?.length) {
    return null;
  }

  return (
    <div className={cn("grid gap-1.5", className)} {...props}>
      {payload.map((item, index) => {
        const labelValue = item.value ?? item.dataKey ?? "";
        const formattedLabel = labelFormatter ? labelFormatter(labelValue) : labelValue;

        return (
          <div key={`${labelValue}-${index}`} className="flex items-center gap-2 text-sm text-muted-foreground">
            {!hideIcon && (
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: item.color ?? "var(--primary)" }}
              />
            )}
            <span>{formattedLabel}</span>
          </div>
        );
      })}
    </div>
  );
}

// Custom Tooltip Content
export function ChartTooltipContent({
  active,
  payload,
  label,
  labelFormatter,
}: ChartTooltipContentProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const formattedLabel = labelFormatter ? labelFormatter(label) : label;

  return (
    <div className="rounded-lg border bg-background/90 px-3 py-2 text-sm shadow-md">
      <p className="mb-1 font-semibold text-foreground">{formattedLabel}</p>
      <div className="grid gap-1">
        {payload.map((item, index) => (
          <div key={`${item.dataKey ?? index}`} className="flex items-center gap-2 text-muted-foreground">
            <span className="h-2 w-2 rounded-full" style={{ background: item.color ?? "var(--primary)" }} />
            <span>{item.name ?? item.dataKey ?? "-"}</span>
            <span className="font-medium text-foreground">
              {item.value ?? item.payload?.value ?? "-"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}