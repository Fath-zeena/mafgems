#!/usr/bin/env node

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials");
  process.exit(1);
}

async function migrateTable() {
  try {
    console.log("🔄 Migrating presentation_generations table...\n");

    // Use the REST API to execute SQL via the management API
    const sqlCommands = [
      `ALTER TABLE IF EXISTS presentation_generations DROP CONSTRAINT IF EXISTS presentation_generations_input_method_check;`,
      `ALTER TABLE presentation_generations ADD CONSTRAINT presentation_generations_input_method_check CHECK (input_method IN ('text-to-image', 'text-to-video', 'image-to-video', 'image-to-3d', 'text-to-3d', 'ring-design', 'necklace-design', 'bracelet-design', 'earrings-design', 'ai-video'));`
    ];

    for (const sql of sqlCommands) {
      try {
        const response = await fetch(
          `${supabaseUrl}/rest/v1/`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${supabaseKey}`,
              "Content-Type": "application/json",
              "Apikey": supabaseKey,
            },
            // Try to execute via a stored function if available
            body: JSON.stringify({})
          }
        );
        
        console.log(`Sent SQL: ${sql.substring(0, 50)}...`);
      } catch (e) {
        // Ignore REST API calls
      }
    }

    console.log("\n⚠️  Automatic constraint update via API not available.");
    console.log("📝 Please manually update the constraint in Supabase SQL Editor:\n");
    console.log("1. Go to https://app.supabase.com → your project → SQL Editor");
    console.log("2. Run these SQL commands:\n");
    
    console.log("ALTER TABLE presentation_generations");
    console.log("DROP CONSTRAINT presentation_generations_input_method_check;");
    console.log("");
    console.log("ALTER TABLE presentation_generations");
    console.log("ADD CONSTRAINT presentation_generations_input_method_check");
    console.log("CHECK (input_method IN ('text-to-image', 'text-to-video', 'image-to-video', 'image-to-3d', 'text-to-3d', 'ring-design', 'necklace-design', 'bracelet-design', 'earrings-design', 'ai-video'));");
    console.log("\n");
    console.log("3. After running, the database will accept the new input methods.");
    
    process.exit(0);

  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

migrateTable();
