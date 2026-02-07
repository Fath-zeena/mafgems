"use client";

import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null;

const SUPABASE_URL = "https://awnihpkyjmycjehgsnzo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3bmlocGt5am15Y2plaGdzbnpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NDg5NjUsImV4cCI6MjA3NjEyNDk2NX0.g6sR7yJoeOXXuJeDSflulUDwBwxbR-h_eoFVdvV37VI";

/**
 * Creates (or returns cached) Supabase client for browser usage.
 */
export function createClient() {
  if (!supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_PUBLISHABLE_KEY;

    supabase = createSupabaseClient(url, anonKey);
  }

  return supabase;
}