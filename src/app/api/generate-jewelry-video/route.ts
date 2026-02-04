import { NextRequest, NextResponse } from "next/server";

/**
 * Jewelry Video Generation API with Human Models
 * Generates promotional videos featuring jewelry pieces worn by human models
 * Integrates with The New Black AI for realistic try-on scenarios
 */

const THE_NEW_BLACK_API_BASE = "https://thenewblack.ai/api/1.1/wf";

interface JewelryVideoRequest {
  collectionId?: string;
  collectionTitle: string;
  gemName: string;
  gemColor: string;
  metalColor: string;
  jewelryType: "ring" | "necklace" | "bracelet" | "earrings";
  modelPreference?: "female" | "male" | "diverse"; // Model preference for video
  videoStyle?: "showcase" | "detailed" | "lifestyle"; // Style of the video
  description?: string;
}

// Map jewelry types to API endpoints with video generation
const videoEndpoints: { [key: string]: string } = {
  ring: "jewelry_ring_video_showcase",
  necklace: "jewelry_necklace_video_showcase",
  bracelet: "jewelry_bracelet_video_showcase",
  earrings: "jewelry_earrings_video_showcase",
};

// Metal descriptions for API requests
const metalDescriptions: { [key: string]: string } = {
  yellow_gold: "yellow gold",
  white_gold: "white gold",
  rose_gold: "rose gold",
  platinum: "platinum",
  silver: "silver",
};

export async function POST(request: NextRequest) {
  try {
    const body: JewelryVideoRequest = await request.json();
    const {
      collectionTitle,
      gemName,
      gemColor,
      metalColor,
      jewelryType,
      modelPreference = "diverse",
      videoStyle = "showcase",
      description,
    } = body;

    // Validate required fields
    if (!collectionTitle || !gemName || !metalColor || !jewelryType) {
      return NextResponse.json(
        {
          error: "Missing required fields: collectionTitle, gemName, metalColor, jewelryType",
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.THE_NEW_BLACK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "The New Black API key not configured. Add THE_NEW_BLACK_API_KEY to environment variables.",
        },
        { status: 500 }
      );
    }

    // Get the appropriate endpoint for video generation
    const endpoint = videoEndpoints[jewelryType] || "jewelry_ring_video_showcase";
    const apiUrl = `${THE_NEW_BLACK_API_BASE}/${endpoint}?api_key=${apiKey}`;

    // Build the request description for the video
    const metalDesc = metalDescriptions[metalColor] || "gold";
    const videoDescription =
      description ||
      `Professional ${videoStyle} video showcasing a stunning ${metalDesc} ${jewelryType} from our ${collectionTitle} collection, featuring a ${gemColor.toLowerCase()} ${gemName} gemstone. ${modelPreference === "diverse" ? "Shown on diverse models." : `Modeled by ${modelPreference} model.`} Perfect for Instagram and social media sharing.`;

    console.log(`[New Black AI] Requesting ${jewelryType} video:`, {
      collectionTitle,
      gemName,
      metalColor,
      modelPreference,
      videoStyle,
      description: videoDescription,
    });

    // Call The New Black AI API for video generation
    const formData = new FormData();
    formData.append("jewelry_description", videoDescription);
    formData.append("jewelry_type", jewelryType);
    formData.append("gem_name", gemName);
    formData.append("gem_color", gemColor);
    formData.append("metal", metalDesc);
    formData.append("video_style", videoStyle);
    formData.append("model_preference", modelPreference);
    formData.append("collection_title", collectionTitle);
    formData.append("output_format", "video"); // Ensure video output

    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
      headers: {
        // Don't set Content-Type; fetch will set it automatically for FormData
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("[New Black AI] API Error:", {
        status: response.status,
        error: errorData,
      });

      if (response.status === 401) {
        return NextResponse.json(
          { error: "Invalid The New Black AI API key" },
          { status: 401 }
        );
      }

      return NextResponse.json(
        {
          error: `The New Black AI API error: ${response.statusText}`,
          details: errorData,
        },
        { status: response.status }
      );
    }

    const result = await response.json();

    console.log("[New Black AI] Video generation success:", {
      jewelryType,
      gemName,
      videoUrl: result.video_url || result.url,
      generationId: result.id,
    });

    // Return the generated video URL and metadata
    return NextResponse.json({
      success: true,
      jewelryType,
      gemName,
      collectionTitle,
      metalColor,
      videoUrl: result.video_url || result.url,
      videoId: result.id || null,
      generationId: result.id || null,
      creditsUsed: result.credits_used || 2, // Videos typically use more credits
      thumbnailUrl: result.thumbnail_url || null,
      duration: result.duration || "15-30 seconds",
      status: result.status || "completed",
    });
  } catch (error) {
    console.error("[New Black AI] Error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        error: "Failed to generate jewelry video",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
