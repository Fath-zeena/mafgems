import { NextRequest, NextResponse } from "next/server";

/**
 * Jewelry Video Generation API
 * Generates jewelry showcase videos with human models for Instagram sharing
 * Integrates with The New Black AI for realistic jewelry visualization
 */

const THE_NEW_BLACK_API_BASE = "https://thenewblack.ai/api/1.1/wf";

interface VideoGenerationRequest {
  gemName: string;
  gemColor: string;
  metalColor: string;
  jewelryType: "ring" | "necklace" | "bracelet" | "earrings";
  modelStyle?: "luxury" | "casual" | "editorial" | "minimalist";
  background?: "studio" | "lifestyle" | "gradient" | "transparent";
  includeText?: boolean;
  brandName?: string;
  hashtagText?: string;
}

interface VideoResponse {
  success: boolean;
  videoUrl?: string;
  status?: string;
  message?: string;
  estimatedTime?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: VideoGenerationRequest = await request.json();
    const {
      gemName,
      gemColor,
      metalColor,
      jewelryType,
      modelStyle = "luxury",
      background = "studio",
      includeText = true,
      brandName = "MAFGEMS",
      hashtagText = "#CustomJewelry #MafgGems",
    } = body;

    // Validate required fields
    if (!gemName || !metalColor || !jewelryType) {
      return NextResponse.json(
        {
          error: "Missing required fields: gemName, metalColor, jewelryType",
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.THE_NEW_BLACK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "New Black AI API key not configured",
        },
        { status: 500 }
      );
    }

    // Construct The New Black AI request
    const prompt = buildVideoPrompt(
      gemName,
      gemColor,
      metalColor,
      jewelryType,
      modelStyle,
      background,
      includeText,
      brandName,
      hashtagText
    );

    // Call The New Black AI API for video generation
    const response = await fetch(
      `${THE_NEW_BLACK_API_BASE}/jewelry_model_video_generation`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          jewelry_type: jewelryType,
          style: modelStyle,
          background_type: background,
          output_format: "mp4",
          resolution: "1080p",
          duration: 15, // 15-second video optimized for Instagram Reels
          include_branding: includeText,
          brand_name: brandName,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("New Black AI API error:", error);
      return NextResponse.json(
        {
          error: "Failed to generate video with New Black AI",
          details: error,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      videoUrl: data.video_url || data.output_url,
      status: data.status || "processing",
      message: "Video generation initiated successfully",
      estimatedTime: 30, // seconds
    });
  } catch (error: any) {
    console.error("Video generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to process video generation request",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

function buildVideoPrompt(
  gemName: string,
  gemColor: string,
  metalColor: string,
  jewelryType: string,
  modelStyle: string,
  background: string,
  includeText: boolean,
  brandName: string,
  hashtagText: string
): string {
  const styleDescriptions: { [key: string]: string } = {
    luxury:
      "A sophisticated female model wearing haute couture, elegant and poised",
    casual: "A modern woman in casual chic outfit, natural and approachable",
    editorial:
      "A professional model in editorial fashion shoot style, artistic lighting",
    minimalist:
      "A person in minimalist white background, clean and professional",
  };

  const backgroundDescriptions: { [key: string]: string } = {
    studio: "Professional studio lighting with white backdrop",
    lifestyle: "Lifestyle setting with natural lighting and elegant decor",
    gradient: "Smooth gradient background, professional and modern",
    transparent: "Transparent background, product-focused",
  };

  const basePrompt = `Create a stunning 15-second jewelry video showcasing a ${metalColor} ${jewelryType} featuring a beautiful ${gemColor} ${gemName}. 
  
Model Style: ${styleDescriptions[modelStyle] || styleDescriptions.luxury}
Background: ${backgroundDescriptions[background] || backgroundDescriptions.studio}

The video should:
- Start with a close-up of the ${jewelryType} on the model
- Slowly rotate/showcase the piece from multiple angles
- Highlight the ${gemName} stone with proper light reflection
- End with a elegant pose showing the complete look
- Include smooth transitions and professional jewelry lighting
${
  includeText
    ? `- Display "${brandName}" branding with "${hashtagText}" at the end`
    : ""
}
- Be optimized for Instagram Reels (1080x1920 format)
- Use warm, professional lighting to enhance the jewel`;

  return basePrompt;
}

// GET endpoint to check video status
export async function GET(request: NextRequest) {
  const videoId = request.nextUrl.searchParams.get("id");

  if (!videoId) {
    return NextResponse.json(
      { error: "Video ID is required" },
      { status: 400 }
    );
  }

  try {
    const apiKey = process.env.THE_NEW_BLACK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // Check status of video generation
    const response = await fetch(
      `${THE_NEW_BLACK_API_BASE}/jewelry_model_video_status`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch video status" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      status: data.status || "processing",
      videoUrl: data.video_url,
      progress: data.progress,
    });
  } catch (error: any) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { error: "Failed to check video status" },
      { status: 500 }
    );
  }
}
