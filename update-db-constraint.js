#!/usr/bin/env node

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateConstraint() {
  try {
    console.log("🔄 Updating presentation_generations table constraint...\n");

    // Try to drop and recreate the constraint
    const sqlStatements = [
      `ALTER TABLE presentation_generations DROP CONSTRAINT presentation_generations_input_method_check;`,
      `ALTER TABLE presentation_generations ADD CONSTRAINT presentation_generations_input_method_check CHECK (input_method IN ('text-to-image', 'text-to-video', 'image-to-video', 'image-to-3d', 'text-to-3d', 'ring-design', 'necklace-design', 'bracelet-design', 'earrings-design', 'ai-video'));`
    ];

    for (const sql of sqlStatements) {
      const { error } = await supabase.rpc("exec_sql", { sql });
      if (error) {
        console.warn("⚠️  Could not use exec_sql. Error:", error.message);
        console.log("\n📝 To update manually in Supabase SQL Editor:");
        console.log("1. Go to https://app.supabase.com → your project");
        console.log("2. SQL Editor → New Query");
        console.log("3. Run these commands:\n");
        for (const s of sqlStatements) {
          console.log(s);
        }
        process.exit(1);
      }
    }

    console.log("✅ Constraint updated successfully!");
    console.log("✅ New input methods added: ring-design, necklace-design, bracelet-design, earrings-design, ai-video\n");

  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

updateConstraint();
