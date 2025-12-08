"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/lib/utils";

// Define a simple type for the payload items expected by Recharts Tooltip/Legend
type PayloadItem = {
  name?: string;
  dataKey?: string;
  color?: string;
  value?: any;
  payload?: any;
};

// Define a simple type for the CustomLegend props
type CustomLegendProps = React.ComponentProps<"div"> & {
  payload?: PayloadItem[];
  verticalAlign?: string;
  hideIcon?: boolean;
  nameKey?: string;
  valueKey?: string;
  labelFormatter?: (value: any) => string;
};

export function CustomLegend({
  payload,
  hideIcon = false,
  nameKey,
  labelFormatter,
  className,
  ...props
}: CustomLegendProps) {
  const items: PayloadItem[] = Array.isArray(payload) ? payload : [];

  if (!items.length) {
    return null;
  }

  return (
    <div className={cn("grid gap-1.5", className)} {...props}>
      {items.map((item, index) => {
        const key = `${nameKey || item.name || item.dataKey || "value"}-${index}`;
        const labelText = item.name || item.dataKey || "";
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

// Tooltip Content Component (Simplified)
type CustomTooltipProps = {
  active?: boolean;
  payload?: PayloadItem[];
  label?: string | number;
  labelFormatter?: (value: any) => string;
  nameKey?: string;
};

export function CustomTooltip({ active, payload, label, labelFormatter, nameKey }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const formattedLabel = labelFormatter ? labelFormatter(label) : label;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-md">
        <p className="text-sm font-medium text-foreground">{formattedLabel}</p>
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}-${index}`;
            const value = item.value ?? item.payload?.value ?? "-";
            return (
              <div key={key} className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-sm" style={{ background: item.color }} />
                {item.name}: {value}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
}

// Exporting the main components
export const ChartContainer = RechartsPrimitive.ResponsiveContainer;
export const ChartTooltip = RechartsPrimitive.Tooltip;
export const ChartLegend = RechartsPrimitive.Legend;
export const ChartXAxis = RechartsPrimitive.XAxis;
export const ChartYAxis = RechartsPrimitive.YAxis;
export const ChartBar = RechartsPrimitive.Bar;
export const ChartLine = RechartsPrimitive.Line;
export const ChartArea = RechartsPrimitive.Area;
export const ChartScatter = RechartsPrimitive.Scatter;
export const ChartPie = RechartsPrimitive.Pie;
export const ChartRadialBar = RechartsPrimitive.RadialBar;
export const ChartComposedChart = RechartsPrimitive.ComposedChart;
export const ChartLineChart = RechartsPrimitive.LineChart;
export const ChartBarChart = RechartsPrimitive.BarChart;
export const ChartAreaChart = RechartsPrimitive.AreaChart;
export const ChartScatterChart = RechartsPrimitive.ScatterChart;
export const ChartPieChart = RechartsPrimitive.PieChart;
export const ChartRadialBarChart = RechartsPrimitive.RadialBarChart;

export default CustomLegend;