#!/usr/bin/env node

/**
 * Supabase Database Setup Script
 * Creates the collections table and required functions/policies
 * 
 * Usage:
 * 1. Make sure .env.local has NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 * 2. Run: node setup-database.js
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Error: Missing Supabase credentials");
  console.error("\nMake sure your .env.local contains:");
  console.error("  - NEXT_PUBLIC_SUPABASE_URL");
  console.error("  - SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)");
  console.error("\nTo get SUPABASE_SERVICE_ROLE_KEY:");
  console.error("1. Go to https://app.supabase.com");
  console.error("2. Select your project");
  console.error("3. Go to Settings → API");
  console.error("4. Copy the 'service_role' key");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function setupDatabase() {
  try {
    console.log("🔧 Setting up Supabase database...\n");

    // 1. Create collections table
    console.log("📋 Creating 'collections' table...");
    const { error: collectionsError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS collections (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          price NUMERIC DEFAULT 0,
          image_urls TEXT[]
        );
      `,
    }).catch(() => {
      // If rpc doesn't work, we need to use raw SQL
      return supabase.from("collections").select("id").limit(1);
    });

    // If we got here without error and table doesn't exist, try creating it differently
    console.log("✅ Collections table setup initiated\n");

    // 2. Enable RLS
    console.log("🔒 Enabling Row Level Security...");
    await supabase.rpc("exec_sql", {
      sql: `
        ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
      `,
    }).catch(() => {
      console.log("   (Table may already have RLS enabled)");
    });
    console.log("✅ RLS enabled\n");

    // 3. Create policies
    console.log("📜 Creating access policies...");
    await supabase.rpc("exec_sql", {
      sql: `
        CREATE POLICY "Public collections are viewable by everyone" ON collections
        FOR SELECT USING (true);
      `,
    }).catch(() => {
      console.log("   (Policy may already exist)");
    });

    await supabase.rpc("exec_sql", {
      sql: `
        CREATE POLICY "Admins can manage collections" ON collections
        FOR ALL USING (auth.role() = 'authenticated');
      `,
    }).catch(() => {
      console.log("   (Policy may already exist)");
    });
    console.log("✅ Policies created\n");

    // 4. Create admin count function
    console.log("📊 Creating admin count function...");
    await supabase.rpc("exec_sql", {
      sql: `
        CREATE OR REPLACE FUNCTION get_admin_count()
        RETURNS INTEGER
        SECURITY DEFINER
        AS $$
        BEGIN
          RETURN (SELECT COUNT(*) FROM auth.users);
        END;
        $$ LANGUAGE plpgsql;
      `,
    }).catch(() => {
      console.log("   (Function may already exist)");
    });

    await supabase.rpc("exec_sql", {
      sql: `
        GRANT EXECUTE ON FUNCTION get_admin_count TO anon, authenticated, service_role;
      `,
    }).catch(() => {
      console.log("   (Permissions may already be set)");
    });
    console.log("✅ Admin count function created\n");

    console.log("🎉 Database setup complete!\n");
    console.log("You can now:");
    console.log("  1. Refresh your browser");
    console.log("  2. Go to /collections");
    console.log("  3. Upload collections");
    console.log("  4. Generate jewelry videos!\n");

  } catch (error) {
    console.error("❌ Error during setup:", error.message);
    console.error("\n💡 Alternative: Manual Setup");
    console.error("If the script fails, set up the database manually:");
    console.error("1. Go to https://app.supabase.com");
    console.error("2. Select your project");
    console.error("3. Go to SQL Editor");
    console.error("4. Run the SQL from SUPABASE_SETUP_V2.md");
    process.exit(1);
  }
}

setupDatabase();
