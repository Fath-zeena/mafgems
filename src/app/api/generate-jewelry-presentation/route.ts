import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * The New Black AI Virtual Try-On API Integration
 * Generates AI jewelry presentations and saves to user_designs table
 */

const THE_NEW_BLACK_API_BASE = "https://thenewblack.ai/api/1.1/wf";

// Initialize Supabase for server-side usage
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://awnihpkyjmycjehgsnzo.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

interface TryOnRequest {
  gemName: string;
  gemColor: string;
  metalColor: string;
  jewelryType: "ring" | "necklace" | "bracelet" | "earrings";
  description?: string;
  userId?: string;
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
    const { gemName, gemColor, metalColor, jewelryType, description, userId } = body;

    // Validate required fields
    if (!gemName || !metalColor || !jewelryType) {
      return NextResponse.json(
        { error: "Missing required fields: gemName, metalColor, jewelryType" },
        { status: 400 }
      );
    }

    const apiKey = process.env.THE_NEW_BLACK_API_KEY;
    if (!apiKey) {
      // Simulate success for UI testing if key is missing
      console.warn("THE_NEW_BLACK_API_KEY missing - simulating for UI testing");
      
      const simulatedUrl = `https://placehold.co/1024x1024/png?text=${gemName}+${jewelryType}`;
      
      if (userId) {
        await supabaseAdmin.from("user_designs").insert({
          user_id: userId,
          gem_name: gemName,
          gem_color: gemColor,
          metal_color: metalColor,
          jewelry_type: jewelryType,
          image_url: simulatedUrl,
          description: description
        });
      }

      return NextResponse.json({
        success: true,
        imageUrl: simulatedUrl,
        message: "Simulation successful (No API key found)"
      });
    }

    // Get the appropriate endpoint for the jewelry type
    const endpoint = jewelryEndpoints[jewelryType] || "jewelry_ring_try_on";
    const apiUrl = `${THE_NEW_BLACK_API_BASE}/${endpoint}?api_key=${apiKey}`;

    const metalDesc = metalDescriptions[metalColor] || "gold";
    const tryOnDescription = description || `A beautiful ${metalDesc} ${jewelryType} featuring a ${gemColor} ${gemName}.`;

    const formData = new FormData();
    formData.append("jewelry_description", tryOnDescription);
    formData.append("jewelry_type", jewelryType);
    formData.append("gem_name", gemName);
    formData.append("gem_color", gemColor);
    formData.append("metal", metalDesc);

    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json({ error: errorData }, { status: response.status });
    }

    const result = await response.json();
    const imageUrl = result.image_url || result.url;

    // Save to user_designs if userId is present
    if (userId && imageUrl) {
      await supabaseAdmin.from("user_designs").insert({
        user_id: userId,
        gem_name: gemName,
        gem_color: gemColor,
        metal_color: metalColor,
        jewelry_type: jewelryType,
        image_url: imageUrl,
        description: tryOnDescription
      });
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      jewelryType,
      gemName,
      metalColor
    });
  } catch (error: any) {
    console.error("[API Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}