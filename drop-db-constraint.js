#!/usr/bin/env node

/**
 * Drop the restrictive input_method constraint from presentation_generations table
 * This allows the app-level validation to handle the growing list of input methods
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials in .env.local");
  process.exit(1);
}

async function dropConstraint() {
  try {
    console.log("🔄 Attempting to drop input_method constraint...\n");

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Try using RPC to execute SQL
    // First, let's try to call a stored procedure if one exists
    const { data: tableInfo, error: infoError } = await supabase
      .from("presentation_generations")
      .select("*")
      .limit(0);

    if (infoError) {
      console.error("❌ Could not access table:", infoError.message);
      process.exit(1);
    }

    console.log("✅ Table exists and is accessible");
    console.log("\n📝 To remove the constraint, run this in Supabase SQL Editor:");
    console.log("   https://app.supabase.com/project/" + supabaseUrl.match(/https:\/\/(.+?)\.supabase/)[1] + "/sql");
    console.log("\nSQL Command:\n");
    console.log("-".repeat(80));
    console.log(`ALTER TABLE presentation_generations DROP CONSTRAINT IF EXISTS presentation_generations_input_method_check;`);
    console.log("-".repeat(80));
    console.log("\nAfter running this command, the app can save presentations with any input_method value.");
    console.log("The app will perform its own validation of input_method values.");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

dropConstraint();
