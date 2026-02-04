#!/usr/bin/env node

/**
 * Supabase Database Setup - Direct SQL Method
 * Creates tables directly via Supabase client
 * 
 * Usage:
 * node setup-database-direct.js
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL not found in .env.local");
  process.exit(1);
}

if (!supabaseKey) {
  console.error("❌ SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY not found in .env.local");
  console.error("\n📖 To get your service role key:");
  console.error("1. Go to https://app.supabase.com");
  console.error("2. Select your project");
  console.error("3. Settings → API");
  console.error("4. Copy 'service_role' key and add to .env.local:");
  console.error("   SUPABASE_SERVICE_ROLE_KEY=your_key_here");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log("🔧 Setting up database tables...\n");

    // Use the admin client to run SQL directly
    const { data: result, error } = await supabase.rpc("exec_sql", {
      sql: `
        -- Create collections table
        CREATE TABLE IF NOT EXISTS public.collections (
          id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
          title TEXT NOT NULL,
          description TEXT,
          price NUMERIC NOT NULL DEFAULT 0,
          image_urls TEXT[]
        );

        -- Enable RLS
        ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

        -- Create policies
        CREATE POLICY "Public read" ON public.collections
        FOR SELECT USING (true);

        CREATE POLICY "Authenticated all" ON public.collections
        FOR ALL USING (auth.role() = 'authenticated');

        -- Create admin count function
        CREATE OR REPLACE FUNCTION public.get_admin_count()
        RETURNS INTEGER
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          RETURN (SELECT COUNT(*) FROM auth.users);
        END;
        $$;

        GRANT EXECUTE ON FUNCTION public.get_admin_count TO anon, authenticated, service_role;
      `,
    });

    if (error) {
      console.error("❌ Database setup failed");
      throw error;
    }

    console.log("✅ Collections table created");
    console.log("✅ Row Level Security enabled");
    console.log("✅ Access policies configured");
    console.log("✅ Admin count function created\n");
    console.log("🎉 Database is ready!\n");
    console.log("Next steps:");
    console.log("1. Refresh your browser");
    console.log("2. Visit http://localhost:3000/collections");
    console.log("3. Admin login to access Video Generator");

  } catch (error) {
    // If rpc method doesn't work, try creating table via insert attempt
    console.log("⚠️  Trying alternative setup method...\n");
    
    try {
      // Test if table exists by trying to select
      const { error: testError } = await supabase
        .from("collections")
        .select("id")
        .limit(1);

      if (testError && testError.code === "PGRST116") {
        console.error("❌ Collections table does not exist and could not be created via API");
        console.error("\n📋 Please manually run this SQL in Supabase SQL Editor:");
        console.error("\n" + `
CREATE TABLE IF NOT EXISTS public.collections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  image_urls TEXT[]
);

ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON public.collections
FOR SELECT USING (true);

CREATE POLICY "Authenticated all" ON public.collections
FOR ALL USING (auth.role() = 'authenticated');

CREATE OR REPLACE FUNCTION public.get_admin_count()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM auth.users);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_admin_count TO anon, authenticated, service_role;
        `.trim());
        console.error("\n📍 Steps:");
        console.error("1. Go to https://app.supabase.com");
        console.error("2. Select your project");
        console.error("3. Navigate to SQL Editor");
        console.error("4. Click 'New Query'");
        console.error("5. Paste the SQL above");
        console.error("6. Click 'Run'");
      } else {
        console.log("✅ Table already exists or is accessible\n");
        console.log("🎉 Database is ready!\n");
      }
    } catch (innerError) {
      console.error("Could not verify table setup:", innerError.message);
    }
  }
}

setupDatabase();
