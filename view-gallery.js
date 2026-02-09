const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const userId = "e91f370d-feb3-4131-bbea-0023308c5c70";

(async () => {
  console.log("📷 Fetching presentation gallery for user:", userId, "\n");

  const { data, error } = await supabase
    .from("presentation_generations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }

  console.log(`✅ Found ${data.length} presentations:\n`);
  
  data.forEach((item, idx) => {
    console.log(`${idx + 1}. ${item.input_method.toUpperCase()}`);
    console.log(`   Type: ${item.output_type}`);
    console.log(`   Jewelry: ${item.jewelry_type}`);
    console.log(`   Image: ${item.output_url.substring(0, 60)}...`);
    console.log(`   Created: ${new Date(item.created_at).toLocaleString()}`);
    console.log();
  });

  process.exit(0);
})();
