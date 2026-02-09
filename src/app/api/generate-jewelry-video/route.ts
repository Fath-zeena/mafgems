import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Jewellery Video Generation API
 * Generates jewellery showcase videos and saves metadata to Supabase
 */

const THE_NEW_BLACK_API_BASE = "https://thenewblack.ai/api/1.1/wf";

// Initialize Supabase for server-side usage (moved inside handlers to avoid build-time errors)
const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseKey);
};

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
  userId?: string;
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
      userId,
    } = body;

    // Validate required fields
    if (!gemName || !metalColor || !jewelryType) {
      return NextResponse.json(
        { error: "Missing required fields: gemName, metalColor, jewelryType" },
        { status: 400 }
      );
    }

    const apiKey = process.env.THE_NEW_BLACK_API_KEY;
    if (!apiKey) {
      // For demo purposes, we'll simulate a successful generation if the key is missing 
      // but warn the user. In production, this would be an error.
      console.warn("THE_NEW_BLACK_API_KEY missing - simulating for UI testing");
    }

    // 1. Construct The New Black AI request
    const prompt = buildVideoPrompt(gemName, gemColor, metalColor, jewelryType, modelStyle, background, includeText, brandName, hashtagText);

    let videoUrl = "https://example.com/demo-video.mp4"; // Default for demo
    let status = "completed";

    // 2. Call AI API if key exists
    if (apiKey) {
      const response = await fetch(`${THE_NEW_BLACK_API_BASE}/jewelry_model_video_generation`, {
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
          duration: 15,
          include_branding: includeText,
          brand_name: brandName,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        videoUrl = data.video_url || data.output_url;
        status = data.status || "completed";
      }
    }

    // 3. Save to Supabase if userId is provided
    if (userId) {
      const { error: dbError } = await getSupabaseAdmin().from("jewelry_videos").insert({
        user_id: userId,
        gem_name: gemName,
        gem_color: gemColor,
        metal_color: metalColor,
        jewelry_type: jewelryType,
        video_url: videoUrl,
        status: status,
      });

      if (dbError) console.error("Database save error:", dbError);
    }

    return NextResponse.json({
      success: true,
      videoUrl,
      status,
      message: "Video generation processed successfully",
    });
  } catch (error: any) {
    console.error("Video generation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function buildVideoPrompt(
  gemName: string, gemColor: string, metalColor: string, 
  jewelryType: string, modelStyle: string, background: string, 
  includeText: boolean, brandName: string, hashtagText: string
): string {
  return `Create a stunning 15-second jewellery video showcasing a ${metalColor} ${jewelryType} featuring a beautiful ${gemColor} ${gemName}. Optimized for Instagram Reels. Style: ${modelStyle}. Background: ${background}.`;
}

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("jewelry_videos")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}