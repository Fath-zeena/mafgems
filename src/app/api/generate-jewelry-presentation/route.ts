import { NextRequest, NextResponse } from "next/server";

/**
 * The New Black AI Virtual Try-On API Integration
 * Generates AI jewelry presentations using The New Black AI platform
 */

const THE_NEW_BLACK_API_BASE = "https://thenewblack.ai/api/1.1/wf";

interface TryOnRequest {
  gemName: string;
  gemColor: string;
  metalColor: string;
  jewelryType: "ring" | "necklace" | "bracelet" | "earrings";
  description?: string;
}

// Map our metal colors to description text
const metalDescriptions: { [key: string]: string } = {
  yellow_gold: "yellow gold",
  white_gold: "white gold",
  rose_gold: "rose gold",
  platinum: "platinum",
  silver: "silver",
};

// Map jewelry types to API endpoints
const jewelryEndpoints: { [key: string]: string } = {
  ring: "jewelry_ring_try_on",
  necklace: "jewelry_necklace_try_on",
  bracelet: "jewelry_bracelet_try_on",
  earrings: "jewelry_earrings_try_on",
};

export async function POST(request: NextRequest) {
  try {
    const body: TryOnRequest = await request.json();
    const { gemName, gemColor, metalColor, jewelryType, description } = body;

    // Validate required fields
    if (!gemName || !metalColor || !jewelryType) {
      return NextResponse.json(
        { error: "Missing required fields: gemName, metalColor, jewelryType" },
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

    // Get the appropriate endpoint for the jewelry type
    const endpoint = jewelryEndpoints[jewelryType] || "jewelry_ring_try_on";
    const apiUrl = `${THE_NEW_BLACK_API_BASE}/${endpoint}?api_key=${apiKey}`;

    // Build the request description
    const metalDesc = metalDescriptions[metalColor] || "gold";
    const tryOnDescription =
      description ||
      `A beautiful ${metalDesc} ${jewelryType} featuring a ${gemColor.toLowerCase()} ${gemName} stone. Professional jewelry photography on a model.`;

    console.log(`[The New Black AI] Requesting ${jewelryType} try-on:`, {
      gemName,
      metalColor,
      description: tryOnDescription,
    });

    // Call The New Black AI API
    const formData = new FormData();
    formData.append("jewelry_description", tryOnDescription);
    formData.append("jewelry_type", jewelryType);
    formData.append("gem_name", gemName);
    formData.append("gem_color", gemColor);
    formData.append("metal", metalDesc);

    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
      headers: {
        // Don't set Content-Type; fetch will set it automatically for FormData
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("[The New Black AI] API Error:", {
        status: response.status,
        error: errorData,
      });

      // Return helpful error message
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

    console.log("[The New Black AI] Success:", {
      jewelryType,
      gemName,
      imageUrl: result.image_url || result.url,
    });

    // Return the generated image/video
    return NextResponse.json({
      success: true,
      jewelryType,
      gemName,
      metalColor,
      imageUrl: result.image_url || result.url,
      videoUrl: result.video_url || null,
      generationId: result.id || null,
      creditsUsed: result.credits_used || 1,
    });
  } catch (error) {
    console.error("[The New Black AI] Error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        error: "Failed to generate jewelry presentation",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
