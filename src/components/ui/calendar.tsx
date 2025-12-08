"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

export function Calendar(props: any) {
  // Provide explicit, permissive typing for the custom components passed to DayPicker
  const components: any = {
    IconLeft: ({ className, ...rest }: { className?: string; [key: string]: any }) => (
      <ChevronLeft className={cn("h-4 w-4", className)} {...rest} />
    ),
    IconRight: ({ className, ...rest }: { className?: string; [key: string]: any }) => (
      <ChevronRight className={cn("h-4 w-4", className)} {...rest} />
    ),
  };

  return (
    <div className="w-full">
      <DayPicker
        components={components}
        {...props}
      />
    </div>
  );
}

export default Calendar;