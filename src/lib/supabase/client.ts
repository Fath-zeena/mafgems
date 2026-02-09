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

    if (!url || !anonKey) {
      throw new Error('Missing Supabase environment variables');
    }

    supabase = createSupabaseClient(url, anonKey);
  }

  return supabase;
}