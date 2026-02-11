"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-background"></div>;
  }

  return <>{children}</>;
}