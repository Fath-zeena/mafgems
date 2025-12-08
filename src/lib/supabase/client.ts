"use client";

import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null;

/**
 * Creates (or returns cached) Supabase client for browser usage.
 * Uses NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
 */
export function createClient() {
  if (typeof window === "undefined") {
    // Server-side usage should create its own client (use server-side pattern separately).
    // Return a client anyway if env is present.
  }

  if (!supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
      // Keep throwing helpful error at runtime rather than compile-time
      // so env can be provided in Netlify/Vercel/UI.
      throw new Error(
        "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
      );
    }

    supabase = createSupabaseClient(url, anonKey);
  }

  return supabase;
}