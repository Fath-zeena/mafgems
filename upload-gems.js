#!/usr/bin/env node

/**
 * Gem Image Upload Script
 * Uploads gem images to Supabase Storage and inserts records into gems table
 * 
 * Usage:
 * 1. Place your gem images in a ./gems-images folder
 * 2. Name them: morganite.jpg, tanzanite.jpg, peridot.jpg
 * 3. Run: node upload-gems.js
 */

const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// Load environment variables
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Error: Missing Supabase environment variables");
  console.error("Make sure NEXT_PUBLIC_SUPABASE_URL is set in .env.local");
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("\n⚠️  SUPABASE_SERVICE_ROLE_KEY not found!");
    console.error("This key is required for database inserts.");
    console.error("\nTo get it:");
    console.error("1. Go to https://app.supabase.com");
    console.error("2. Select your project");
    console.error("3. Settings → API");
    console.error("4. Copy 'Service Role Key'");
    console.error("5. Add to .env.local: SUPABASE_SERVICE_ROLE_KEY=your_key_here");
  }
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Gem configuration
const GEMS_CONFIG = [
  {
    name: "Morganite",
    color: "#FF99CC",
    filename: "morganite",
  },
  {
    name: "Tanzanite",
    color: "#0047AB",
    filename: "tanzanite",
  },
  {
    name: "Citrine",
    color: "#E06377",
    filename: "citrine",
  },
  {
    name: "Garnet",
    color: "#922B3E",
    filename: "garnet",
  },
  {
    name: "Opal",
    color: "#A9A9A9",
    filename: "opal",
  },
];

const BUCKET_NAME = "gems";
const IMAGES_FOLDER = path.join(__dirname, "gems-images");

async function uploadGemImages() {
  console.log("🚀 Starting gem image upload...\n");

  // Check if folder exists
  if (!fs.existsSync(IMAGES_FOLDER)) {
    console.error(`❌ Error: Folder not found: ${IMAGES_FOLDER}`);
    console.log(`\n📁 Please create a folder named "gems-images" in your project root`);
    console.log(`📸 Place your gem images there with these names:`);
    GEMS_CONFIG.forEach((gem) => {
      console.log(`   - ${gem.filename}.jpg (or .png)`);
    });
    process.exit(1);
  }

  const results = [];

  for (const gemConfig of GEMS_CONFIG) {
    try {
      // Find the image file (try .jpg, .png, etc.)
      let imagePath = null;
      const extensions = [".jpg", ".jpeg", ".png", ".webp"];

      for (const ext of extensions) {
        const fullPath = path.join(IMAGES_FOLDER, `${gemConfig.filename}${ext}`);
        if (fs.existsSync(fullPath)) {
          imagePath = fullPath;
          break;
        }
      }

      if (!imagePath) {
        console.log(
          `⚠️  Skipped ${gemConfig.name}: Image not found (looked for ${gemConfig.filename}.{jpg,png,webp})`
        );
        results.push({
          gem: gemConfig.name,
          status: "skipped",
          message: "Image file not found",
        });
        continue;
      }

      // Read file
      const fileContent = fs.readFileSync(imagePath);
      const fileName = `${gemConfig.filename}${path.extname(imagePath)}`;

      console.log(`📤 Uploading ${gemConfig.name}...`);

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, fileContent, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

      const imageUrl = publicUrlData?.publicUrl;

      // Insert into database
      const { error: insertError } = await supabase.from("gems").insert([
        {
          name: gemConfig.name,
          color: gemConfig.color,
          image_url: imageUrl,
        },
      ]);

      if (insertError) {
        throw insertError;
      }

      console.log(`✅ ${gemConfig.name} uploaded successfully!`);
      console.log(`   URL: ${imageUrl}\n`);

      results.push({
        gem: gemConfig.name,
        status: "success",
        url: imageUrl,
      });
    } catch (error) {
      console.error(`❌ Error uploading ${gemConfig.name}:`);
      console.error(`   ${error.message}\n`);

      results.push({
        gem: gemConfig.name,
        status: "error",
        message: error.message,
      });
    }
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 Upload Summary:");
  console.log("=".repeat(60));

  const successful = results.filter((r) => r.status === "success").length;
  const failed = results.filter((r) => r.status === "error").length;
  const skipped = results.filter((r) => r.status === "skipped").length;

  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️  Skipped: ${skipped}`);

  if (failed === 0 && successful > 0) {
    console.log(`\n🎉 All gems uploaded successfully!`);
    console.log(`🔄 Refresh your browser to see the new gems in the gallery.`);
  }
}

uploadGemImages().catch(console.error);
