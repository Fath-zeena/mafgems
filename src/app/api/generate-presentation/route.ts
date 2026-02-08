import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * The New Black AI - Comprehensive Jewellery Presentation Generator
 * Supports: Text to Image, Text to Video, Image to Video, Image to 3D, Text to 3D
 */

const THE_NEW_BLACK_API_BASE = "https://thenewblack.ai/api/1.1/wf";

// Initialize Supabase for server-side usage
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

interface PresentationRequest {
  inputMethod: "text-to-image" | "text-to-video" | "image-to-video" | "image-to-3d" | "text-to-3d";
  textPrompt?: string;
  imageUrl?: string;
  
  // Workflow configuration
  jewelryType: string;
  modelProfile: string;
  background: string;
  outfitConfig: string;
  outputFormat: string;
  
  // Style options
  styleReference: string;
  colorPalette: string;
  resolution: string;
  detailLevel: number;
  lightingStyle: string;
  
  // Video settings
  videoDuration?: string;
  frameRate?: string;
  videoStyle?: string;
  
  // Advanced options
  modelBodyType: string;
  skinTone: string;
  iterationMode: string;
  
  // User info
  userId?: string;
}

// Map workflow options to API parameters
const workflowMapping: { [key: string]: string } = {
  "text-to-image": "jewelry_text_to_image",
  "text-to-video": "jewelry_text_to_video",
  "image-to-video": "jewelry_image_to_video",
  "image-to-3d": "jewelry_image_to_3d",
  "text-to-3d": "jewelry_text_to_3d",
};

const modelProfiles: { [key: string]: string } = {
  frontal: "frontal_view",
  side: "side_view",
  back: "back_view",
  "full-body": "full_body",
  detail: "detail_close_up",
};

const backgrounds: { [key: string]: string } = {
  white: "white_studio",
  studio: "studio_gradient",
  outdoor: "outdoor",
  minimalist: "minimalist",
  custom: "custom_color",
  transparent: "transparent",
};

export async function POST(request: NextRequest) {
  let body: PresentationRequest;
  
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON in request body" },
      { status: 400 }
    );
  }

  try {
    // Validate required fields
    if (!body.inputMethod) {
      return NextResponse.json(
        { error: "Missing required field: inputMethod" },
        { status: 400 }
      );
    }

    const validMethods = ["text-to-image", "text-to-video", "image-to-video", "image-to-3d", "text-to-3d"];
    if (!validMethods.includes(body.inputMethod)) {
      return NextResponse.json(
        { error: `Invalid inputMethod. Must be one of: ${validMethods.join(", ")}` },
        { status: 400 }
      );
    }

    const isTextBased = ["text-to-image", "text-to-video", "text-to-3d"].includes(body.inputMethod);
    const isImageBased = ["image-to-video", "image-to-3d"].includes(body.inputMethod);

    if (isTextBased && !body.textPrompt?.trim()) {
      return NextResponse.json(
        { error: "Text prompt is required for this input method" },
        { status: 400 }
      );
    }

    if (isImageBased && !body.imageUrl?.trim()) {
      return NextResponse.json(
        { error: "Image URL is required for this input method" },
        { status: 400 }
      );
    }

    // Validate required workflow fields
    if (!body.jewelryType) {
      return NextResponse.json(
        { error: "Jewelry type is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.THE_NEW_BLACK_API_KEY;
    if (!apiKey) {
      console.warn("THE_NEW_BLACK_API_KEY missing - using simulated response");
      
      // Return simulated response for testing
      const simulatedUrl = generateSimulatedUrl(body);
      
      if (body.userId) {
        try {
          await supabaseAdmin.from("presentation_generations").insert({
            user_id: body.userId,
            input_method: body.inputMethod,
            jewelry_type: body.jewelryType,
            output_url: simulatedUrl,
            output_type: body.inputMethod.includes("video") || body.inputMethod.includes("3d") ? "complex" : "image",
            configuration: JSON.stringify(body),
            status: "completed",
            created_at: new Date().toISOString(),
          });
        } catch (dbErr) {
          console.warn("Could not save to database:", dbErr);
        }
      }

      return NextResponse.json({
        success: true,
        outputUrl: simulatedUrl,
        outputType: body.inputMethod.includes("video") ? "video" : body.inputMethod.includes("3d") ? "3d" : "image",
        message: "Simulated response (No API key found)",
      });
    }

    // Call The New Black AI API with proper error handling
    const workflow = workflowMapping[body.inputMethod] || "jewelry_text_to_image";
    const apiUrl = `${THE_NEW_BLACK_API_BASE}/${workflow}?api_key=${apiKey}`;

    const formData = new FormData();
    
    // Add common parameters
    formData.append("jewelry_type", body.jewelryType);
    formData.append("model_profile", modelProfiles[body.modelProfile] || body.modelProfile);
    formData.append("background_style", backgrounds[body.background] || body.background);
    formData.append("output_format", body.outputFormat);
    formData.append("style_reference", body.styleReference);
    formData.append("color_palette", body.colorPalette);
    formData.append("resolution", body.resolution);
    formData.append("detail_level", body.detailLevel.toString());
    formData.append("lighting_style", body.lightingStyle);
    formData.append("model_body_type", body.modelBodyType);
    formData.append("skin_tone", body.skinTone);
    formData.append("iteration_mode", body.iterationMode);
    formData.append("outfit_config", body.outfitConfig);

    // Add input-specific parameters
    if (isTextBased && body.textPrompt) {
      formData.append("prompt", body.textPrompt);
    }

    if (isImageBased && body.imageUrl) {
      formData.append("image_url", body.imageUrl);
    }

    // Add video parameters if applicable
    if (body.inputMethod.includes("video")) {
      formData.append("duration", body.videoDuration || "30");
      formData.append("frame_rate", body.frameRate || "30");
      formData.append("video_style", body.videoStyle || "rotate");
    }

    console.log(`[API] Calling The New Black AI: ${workflow}`);
    
    let response: Response;
    let result: any;
    
    try {
      response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
        signal: AbortSignal.timeout(120000), // 2-minute timeout
      });
    } catch (error: any) {
      if (error.name === "AbortError") {
        return NextResponse.json(
          { error: "Request timeout: The New Black AI took too long to respond. Please try again." },
          { status: 504 }
        );
      }
      console.error("[Network Error]:", error);
      return NextResponse.json(
        { error: `Network error: ${error.message}` },
        { status: 503 }
      );
    }

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      let errorData: string;
      
      try {
        if (contentType?.includes("application/json")) {
          errorData = JSON.stringify(await response.json());
        } else {
          errorData = await response.text();
        }
      } catch {
        errorData = `HTTP ${response.status}: ${response.statusText}`;
      }

      console.error(`[The New Black API Error] Status: ${response.status}`, errorData);
      
      const errorMessage = {
        400: "Bad request: Check your configuration parameters",
        401: "Authentication failed: Invalid API key",
        403: "Access forbidden: You don't have permission",
        404: "Not found: Invalid workflow",
        429: "Rate limited: Too many requests, please try again later",
        500: "The New Black AI server error: Please try again",
      }[response.status] || `API error: ${response.statusText}`;

      return NextResponse.json(
        { error: errorMessage, details: errorData },
        { status: response.status }
      );
    }

    try {
      result = await response.json();
    } catch (parseErr) {
      console.error("[JSON Parse Error]:", parseErr);
      return NextResponse.json(
        { error: "Failed to parse API response" },
        { status: 502 }
      );
    }

    const outputUrl = result.output_url || result.image_url || result.video_url || result.model_url || result.url;
    
    if (!outputUrl) {
      console.error("[API Response Missing URL]:", result);
      return NextResponse.json(
        { error: "API returned invalid response: missing output URL" },
        { status: 502 }
      );
    }

    // Determine output type
    let outputType = "image";
    if (body.inputMethod.includes("video")) outputType = "video";
    if (body.inputMethod.includes("3d")) outputType = "3d";

    // Save to database if userId is present
    if (body.userId) {
      try {
        await supabaseAdmin.from("presentation_generations").insert({
          user_id: body.userId,
          input_method: body.inputMethod,
          jewelry_type: body.jewelryType,
          output_url: outputUrl,
          output_type: outputType,
          configuration: JSON.stringify(body),
          status: "completed",
          created_at: new Date().toISOString(),
        });
      } catch (dbErr: any) {
        console.warn("[Database Save Error]:", dbErr.message);
        // Don't fail the request if DB save fails - user still gets their output
      }
    }

    console.log(`[API Success] Generated ${outputType} for jewelry type: ${body.jewelryType}`);

    return NextResponse.json({
      success: true,
      outputUrl,
      outputType,
      inputMethod: body.inputMethod,
      jewelryType: body.jewelryType,
      configuration: body,
    });
  } catch (error: any) {
    console.error("[Unhandled API Error]:", error);
    return NextResponse.json(
      { 
        error: error.message || "Internal server error",
        type: error.name,
      },
      { status: 500 }
    );
  }
}

/**
 * Generate simulated URLs for testing when API key is not available
 */
function generateSimulatedUrl(config: PresentationRequest): string {
  const baseUrls = {
    "text-to-image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1024&q=80",
    "text-to-video": "https://media.coverta.ai/sample-jewelry-video.mp4",
    "image-to-video": "https://media.coverta.ai/sample-jewelry-animation.mp4",
    "image-to-3d": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1024&q=80",
    "text-to-3d": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1024&q=80",
  };

  return baseUrls[config.inputMethod] || baseUrls["text-to-image"];
}
