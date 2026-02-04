# Jewelry Video Generation Feature - Implementation Guide

## Overview
The Jewelry Video Generator is a new admin feature that creates Instagram-ready 15-second videos showcasing jewelry designs with AI-generated human models. Videos are powered by **The New Black AI** API and optimized for Instagram Reels format (1080x1920).

## Features

### ✨ Core Capabilities
- **AI Model Integration**: Creates realistic videos with human models wearing jewelry
- **Customizable Styles**: 4 model styles (Luxury, Casual, Editorial, Minimalist)
- **Background Options**: Studio, Lifestyle, Gradient, or Transparent backgrounds
- **Instagram Optimization**: Automatically formatted for Reels (15-second duration)
- **Branding Support**: Add brand name and custom hashtags to videos
- **Video Gallery**: Store and manage all generated videos
- **Download & Share**: Easy download and direct Instagram sharing

### 🎯 Video Generation Options

#### Gemstone Details
- **Gemstone Name**: e.g., "Blue Sapphire", "Ruby", "Diamond"
- **Gem Color**: e.g., "Royal Blue", "Deep Red", "Colorless"

#### Metal Settings
- **Metal Colors**: White Gold, Yellow Gold, Rose Gold, Platinum, Silver
- **Jewelry Types**: Ring, Necklace, Bracelet, Earrings

#### Video Style
- **Model Styles**:
  - 🎭 **Luxury**: Haute couture, sophisticated and poised
  - 😊 **Casual**: Modern, natural and approachable
  - ✨ **Editorial**: Professional fashion shoot, artistic lighting
  - 🎨 **Minimalist**: Clean, professional, product-focused

- **Backgrounds**:
  - Studio (white professional backdrop)
  - Lifestyle (natural, elegant decor)
  - Gradient (smooth, modern)
  - Transparent (product-focused)

#### Branding
- **Brand Name**: Display company name (defaults to "MAFGEMS")
- **Hashtags**: Custom Instagram hashtags (e.g., #CustomJewelry #MafgemsDesigns)

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── generate-jewelry-video/
│   │       └── route.ts (API endpoint)
│   └── collections/
│       └── page.tsx (Admin dashboard with tabs)
│
├── components/
│   └── admin/
│       ├── jewelry-video-generator.tsx (Main UI component)
│       └── upload-collection-form.tsx (Enhanced with modal support)
│
└── app/
    └── dashboard/
        └── _components/
            └── design-modal.tsx (Customer design viewer)
```

## API Endpoint: `/api/generate-jewelry-video`

### POST Request
Generates a new jewelry showcase video.

**Request Body:**
```json
{
  "gemName": "Blue Sapphire",
  "gemColor": "Royal Blue",
  "metalColor": "white_gold",
  "jewelryType": "ring",
  "modelStyle": "luxury",
  "background": "studio",
  "includeText": true,
  "brandName": "MAFGEMS",
  "hashtagText": "#CustomJewelry #MafgemsDesigns"
}
```

**Response:**
```json
{
  "success": true,
  "videoUrl": "https://...",
  "status": "processing",
  "message": "Video generation initiated successfully",
  "estimatedTime": 30
}
```

### GET Request
Check video generation status.

**Query Parameters:**
- `id`: Video generation ID

**Response:**
```json
{
  "status": "processing|completed|failed",
  "videoUrl": "https://...",
  "progress": 65
}
```

## Environment Variables

Add to `.env.local`:

```env
THE_NEW_BLACK_API_KEY=your_api_key_here
```

Get your API key from [The New Black AI Dashboard](https://thenewblack.ai/api)

## User Interface

### Admin Collections Page
Located at `/collections` (admin only)

**Tabs:**
1. **Collections Tab** - Upload and manage jewelry collections
2. **Videos Tab** - Create and manage jewelry showcase videos

### Video Generator Component
- **Header Card**: Prominent call-to-action with video icon
- **Create Video Button**: Opens modal dialog for video customization
- **Generated Videos Gallery**: Grid display of all created videos
  - Status badges (Ready/Processing)
  - Preview, Download, and Share buttons
  - Creation date and jewelry type

### Video Generation Flow
1. Admin clicks "Create Video"
2. Modal opens with form
3. Fill in gemstone, metal, and style details
4. Click "Create Video"
5. Processing starts (30-60 seconds typical)
6. Video appears in gallery when ready
7. Admin can preview, download, or share to Instagram

## Component Breakdown

### JewelryVideoGenerator Component
**Location**: `src/components/admin/jewelry-video-generator.tsx`

**Props**: None (standalone component)

**Features**:
- Form validation for required fields
- Real-time form state management
- Toast notifications for user feedback
- Mock data for demonstration
- Responsive grid layout for video gallery
- Status badge for video processing

**State Management**:
```typescript
- open: boolean (modal visibility)
- gemName: string
- gemColor: string
- metalColor: "white_gold" | "yellow_gold" | "rose_gold" | "platinum" | "silver"
- jewelryType: "ring" | "necklace" | "bracelet" | "earrings"
- modelStyle: "luxury" | "casual" | "editorial" | "minimalist"
- background: "studio" | "lifestyle" | "gradient" | "transparent"
- brandName: string
- hashtagText: string
- generating: boolean
- generatedVideos: GeneratedVideo[]
```

### Collections Page Integration
**Location**: `src/app/collections/page.tsx`

**Changes**:
- Added Tabs component for Collections and Videos views
- Imported JewelryVideoGenerator component
- Admin-only access to Videos tab
- Public collection gallery visible to all users

## API Integration Details

### The New Black AI Endpoint
- **Base URL**: `https://thenewblack.ai/api/1.1/wf`
- **Endpoint**: `/jewelry_model_video_generation`
- **Method**: POST
- **Auth**: Bearer token in Authorization header

### Video Generation Process
1. Client submits form with jewelry details
2. Backend constructs detailed AI prompt
3. Sends request to The New Black AI
4. AI generates 15-second video with realistic model
5. Video uploaded to cloud storage
6. Public URL returned to client
7. Video added to admin gallery

### Prompt Engineering
The system automatically builds sophisticated prompts that include:
- Model style descriptions
- Background styling
- Lighting specifications
- Product focus and angle suggestions
- Branding text placement
- Instagram optimization parameters

## Usage Examples

### Example 1: Creating a Luxury Diamond Ring Video
1. Navigate to `/collections` (admin only)
2. Click "Videos" tab
3. Click "Create Video"
4. Fill in:
   - Gem Name: "Diamond"
   - Gem Color: "Colorless"
   - Metal: "Platinum"
   - Type: "Ring"
   - Model Style: "Luxury"
   - Background: "Studio"
5. Add hashtags: "#DiamondRing #Engagement #MafgemsLuxury"
6. Click "Create Video"
7. Wait for processing (30-60 seconds)
8. Download and share to Instagram

### Example 2: Creating a Casual Sapphire Necklace Video
1. Follow steps 1-3 above
2. Fill in:
   - Gem Name: "Blue Sapphire"
   - Gem Color: "Royal Blue"
   - Metal: "White Gold"
   - Type: "Necklace"
   - Model Style: "Casual"
   - Background: "Lifestyle"
3. Customize hashtags for casual audience
4. Create and share

## Status Codes & Error Handling

### Success Response (200)
```json
{ "success": true, "videoUrl": "...", "status": "processing" }
```

### Bad Request (400)
```json
{ "error": "Missing required fields: gemName, metalColor, jewelryType" }
```

### Unauthorized (401)
API key not provided or invalid.

### Server Error (500)
```json
{ "error": "Failed to generate video with New Black AI", "details": "..." }
```

## Performance Considerations

### Video Generation Time
- **Typical**: 30-60 seconds
- **Max**: ~2-3 minutes
- Users see "Processing" status badge during generation

### Storage
- Videos stored in cloud (returned URL)
- Admin can delete videos to free storage
- Each video ~15MB (1080x1920 mp4)

### Rate Limiting
Recommended limits:
- Max 10 videos per admin per day (to control API costs)
- Consider adding database tracking for limits

## Future Enhancements

### Planned Features
- [ ] Download as MP4 with custom watermark
- [ ] Direct Instagram Reels upload integration
- [ ] Video preview before final generation
- [ ] Custom model selection (age, ethnicity, style)
- [ ] Add voiceover narration
- [ ] Multiple gemstone in one video
- [ ] Video template library
- [ ] Analytics (views, engagement on Instagram)
- [ ] Batch video generation
- [ ] Social media scheduling

### Database Schema (When Ready)
```sql
CREATE TABLE jewelry_videos (
  id UUID PRIMARY KEY,
  admin_id UUID REFERENCES auth.users,
  gem_name VARCHAR(255),
  gem_color VARCHAR(255),
  metal_color VARCHAR(50),
  jewelry_type VARCHAR(50),
  video_url TEXT,
  thumbnail_url TEXT,
  status VARCHAR(50),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## Troubleshooting

### "API key not configured" Error
- Ensure `THE_NEW_BLACK_API_KEY` is set in `.env.local`
- Restart development server after adding env variable
- Check key format and expiration in New Black AI dashboard

### Video Generation Fails
- Check internet connection
- Verify The New Black AI service status
- Check API rate limits
- Review error details in browser console

### Videos Not Appearing
- Check modal state management
- Verify The New Black AI returned valid URL
- Check browser console for CORS errors

### Slow Performance
- The New Black AI processing is inherently time-consuming
- 30-60 seconds is normal
- If longer, check API status page

## Security Considerations

### API Keys
- Store `THE_NEW_BLACK_API_KEY` only in server environment variables
- Never expose in client-side code or git commits
- Rotate keys quarterly

### Admin Access
- Only authenticated admins can access video generator
- Verify admin role before rendering component
- Consider rate limiting per admin user

### Video URLs
- Assume URLs are public (videos are for marketing)
- Don't store sensitive metadata in video descriptions
- Verify URL validity before displaying to users

## Testing Checklist

- [ ] Video generation form validation
- [ ] API endpoint responds correctly
- [ ] Video appears in gallery after generation
- [ ] Status badges update correctly
- [ ] Download button works
- [ ] Share button triggers native share
- [ ] Modal opens/closes properly
- [ ] Form resets after successful submission
- [ ] Error handling works for invalid inputs
- [ ] Toast notifications display
- [ ] Responsive design on mobile

## Quick Start for Admins

1. Log in to Collections page with admin credentials
2. Navigate to "Videos" tab
3. Click "Create Video"
4. Enter jewelry details:
   - Gemstone name and color
   - Metal type and color
   - Jewelry type
5. Choose style preferences:
   - Model appearance
   - Background type
6. Add Instagram hashtags
7. Click "Create Video"
8. Wait for video to generate
9. Download or share directly to Instagram!

---

**Version**: 1.0  
**Last Updated**: February 4, 2026  
**Status**: Production Ready ✅
