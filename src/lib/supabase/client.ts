"use client";

import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null;

/**
 * Creates (or returns cached) Supabase client for browser usage.
 */
export function createClient() {
  if (!supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const isPlaceholder =
      !url || !anonKey || url.includes("your-project") || anonKey.includes("your-anon");

    if (isPlaceholder) {
      // Return a lightweight mock client that surfaces a clear error object
      const mockClient = {
        from: (_table: string) => ({
          select: async (_cols?: string) => {
            return {
              data: null,
              error: { message: "Supabase not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local" },
            };
          },
        }),
      } as unknown as SupabaseClient;

      supabase = mockClient;
    } else {
      supabase = createSupabaseClient(url, anonKey);
    }
  }

  return supabase;
}