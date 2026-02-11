import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import axios from 'axios';

// Initialize OpenAI only when needed to avoid build-time errors
const getOpenAI = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }
  return new OpenAI({ apiKey });
};

// Get HeyGen API key when needed
const getHeyGenKey = () => {
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) {
    throw new Error('HEYGEN_API_KEY is not configured');
  }
  return apiKey;
};

// Placeholder for a HeyGen template ID you would create in their studio
const HEYGEN_TEMPLATE_ID = "YOUR_HEYGEN_TEMPLATE_ID"; 
const HEYGEN_AVATAR_ID = "YOUR_HEYGEN_AVATAR_ID"; 

export async function POST(request: Request) {
  try {
    getHeyGenKey(); // Check if HeyGen key is available
    const openai = getOpenAI();

    const { gemName, metalColor, imageUrl } = await request.json();

    // 1. AI Brain: Generate the script using OpenAI
    const prompt = `You are a luxury jewellery concierge for MAFGEMS. Write a short, elegant, 20-second script (max 50 words) to present a custom piece of jewellery. The piece is a ${gemName} set in ${metalColor} gold. Focus on the luxury and timelessness of the design.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Using a fast model for script generation
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
    });

    const script = completion.choices[0].message.content || "Discover your exquisite custom jewellery piece.";

    // 2. AI Face: Send the script and image to HeyGen API
    const heygenPayload = {
      // This payload structure is conceptual and depends on your HeyGen template setup
      template_id: HEYGEN_TEMPLATE_ID,
      avatar_id: HEYGEN_AVATAR_ID,
      script: script,
      // Assuming your template has a placeholder for the jewelry image
      variables: {
        jewelry_image: imageUrl,
        gem_name: gemName,
      },
      // Other necessary parameters like voice, background, etc.
    };

    const heygenResponse = await axios.post('https://api.heygen.com/v1/video.generate', heygenPayload, {
      headers: {
        'X-Api-Key': getHeyGenKey(),
        'Content-Type': 'application/json',
      },
    });

    // In a real app, you would save the video ID and poll for the result.
    // For now, we return the HeyGen response ID.
    return NextResponse.json({ 
      message: "Video generation started.", 
      videoId: heygenResponse.data.id 
    });

  } catch (error) {
    console.error("Video generation failed:", error);
    return NextResponse.json({ error: "Failed to start video generation." }, { status: 500 });
  }
}