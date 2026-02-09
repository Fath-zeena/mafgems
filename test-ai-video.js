const userId = "e91f370d-feb3-4131-bbea-0023308c5c70";

async function testAiVideo() {
  console.log("🎬 Testing: ai-video method\n");
  
  try {
    const payload = {
      inputMethod: "ai-video",
      jewelryType: "ring",
      textPrompt: "Ring spinning with lights",
      imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1024&q=80",
      videoDuration: "5",
      userId: userId
    };

    console.log("Sending payload:", JSON.stringify(payload, null, 2));

    const response = await fetch('http://localhost:3000/api/generate-presentation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    console.log("\n✅ Response:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testAiVideo();
