const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const userId = "e91f370d-feb3-4131-bbea-0023308c5c70";

const testCases = [
  { inputMethod: "necklace-design", jewelryType: "necklace", prompt: "Gold diamond necklace" },
  { inputMethod: "bracelet-design", jewelryType: "bracelet", prompt: "Silver tennis bracelet" },
  { inputMethod: "earrings-design", jewelryType: "earrings", prompt: "Pearl drop earrings" },
];

async function testMethod(testCase) {
  console.log(`\n🧪 Testing: ${testCase.inputMethod}`);
  
  try {
    const response = await fetch('http://localhost:3000/api/generate-presentation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inputMethod: testCase.inputMethod,
        jewelryType: testCase.jewelryType,
        textPrompt: testCase.prompt,
        gender: 'woman',
        userId: userId
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log(`   ✅ Success! Output: ${data.outputUrl.substring(0, 50)}...`);
    } else {
      console.log(`   ❌ Failed: ${data.error}`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
}

(async () => {
  console.log("🚀 Testing all jewelry design input methods...");
  
  for (const testCase of testCases) {
    await testMethod(testCase);
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between requests
  }
  
  console.log("\n✅ All tests complete!");
})();
