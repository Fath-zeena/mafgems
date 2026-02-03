#!/usr/bin/env node

/**
 * Create Supabase Storage Bucket
 * Creates the 'gems' bucket if it doesn't exist
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Error: Missing Supabase credentials");
  console.error("Make sure NEXT_PUBLIC_SUPABASE_URL is set in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createBucket() {
  try {
    console.log("🔍 Checking for 'gems' bucket...\n");

    // Try to create the bucket
    const { data, error } = await supabase.storage.createBucket("gems", {
      public: true,
    });

    if (error && error.message.includes("already exists")) {
      console.log("✅ 'gems' bucket already exists!");
      return;
    }

    if (error) {
      console.error("❌ Error:", error.message);
      console.log("\n📝 Manual Setup:");
      console.log("1. Go to https://app.supabase.com");
      console.log("2. Select your project");
      console.log("3. Go to Storage → Create a new bucket");
      console.log("4. Name: 'gems'");
      console.log("5. Set to Public");
      process.exit(1);
    }

    console.log("✅ 'gems' bucket created successfully!");
    console.log("\n📸 Next steps:");
    console.log("1. Create gems-images folder with your 3 images");
    console.log("2. Run: node upload-gems.js");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

createBucket();
