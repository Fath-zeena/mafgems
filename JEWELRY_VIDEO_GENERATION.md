# Jewelry Video Generation Feature

## Overview

The new **Jewelry Video Generation** feature allows admins to create professional Instagram-ready videos showcasing jewelry pieces with AI-powered human models. This integrates with **The New Black AI** API, the same service used for jewelry presentations.

## Features

### 1. **Video Generation**
- Generate videos for all jewelry types (rings, necklaces, bracelets, earrings)
- Support for multiple gemstone types and colors
- Multiple metal options (white gold, yellow gold, rose gold, platinum, silver)
- Choose video style: Showcase, Detailed, or Lifestyle
- Select model preferences: Female, Male, or Diverse

### 2. **Video Management**
- Preview generated videos directly in the modal
- Copy video URLs to clipboard
- Download videos for local storage
- Direct sharing to Instagram
- Display video metadata (duration, style, generation ID)

### 3. **Integration Points**
- Standalone button in Admin Collections dashboard
- Per-collection video generation buttons
- Seamless modal-based workflow

## Usage

### For Admins

#### Generate a Video

1. **Navigate to Collections Page** (`/collections`)
2. **Login as Admin** (if not already logged in)
3. **Option A: Generate Generic Video**
   - Click "Generate Instagram Video" (top right button)
   - Select jewelry details and preferences
   - Click "Generate Instagram Video" button
   - Wait for AI to generate the video (~30-60 seconds)

4. **Option B: Generate Video for Specific Collection**
   - Scroll to desired collection
   - Click "Generate Video" button on collection card
   - The collection name will be pre-filled
   - Select jewelry details and preferences
   - Click "Generate Instagram Video" button

#### Customize Video Settings

- **Jewelry Type**: Ring, Necklace, Bracelet, or Earrings
- **Gemstone**: Choose from Diamond, Ruby, Emerald, Sapphire, Topaz, Amethyst, Pearl, Opal
- **Gem Color**: White, Blue, Red, Green, Yellow, Purple, Pink, Gold
- **Metal**: White Gold, Yellow Gold, Rose Gold, Platinum, Silver
- **Video Style**:
  - **Showcase**: Clean background, focuses on the piece
  - **Detailed**: Close-up focus on gemstone and detailing
  - **Lifestyle**: Shows the piece being worn in real scenario
- **Model Preference**:
  - **Female Model**: Professional female model
  - **Male Model**: Professional male model
  - **Diverse Models Mix**: Multiple models of different backgrounds
- **Custom Description** (Optional): Add special instructions for the video

#### Share Generated Videos

After video generation completes:
1. **Preview**: Watch the video in the modal
2. **Copy URL**: Click "Copy Link" to copy the video URL
3. **Download**: Click "Download" to save locally as MP4
4. **Share on Instagram**: Click "Share on Instagram" to open sharing dialog
5. **Generate Another**: Click "Generate Another Video" to create a different video

## API Endpoint

### Generate Jewelry Video
- **URL**: `/api/generate-jewelry-video`
- **Method**: `POST`
- **Content-Type**: `application/json`

#### Request Body
```json
{
  "collectionTitle": "Royal Sapphire Collection",
  "gemName": "Sapphire",
  "gemColor": "blue",
  "metalColor": "white_gold",
  "jewelryType": "ring",
  "modelPreference": "diverse",
  "videoStyle": "showcase",
  "description": "Optional custom description"
}
```

#### Response (Success)
```json
{
  "success": true,
  "jewelryType": "ring",
  "gemName": "Sapphire",
  "collectionTitle": "Royal Sapphire Collection",
  "metalColor": "white_gold",
  "videoUrl": "https://...",
  "videoId": "video_123",
  "generationId": "gen_456",
  "creditsUsed": 2,
  "thumbnailUrl": "https://...",
  "duration": "15-30 seconds",
  "status": "completed"
}
```

#### Response (Error)
```json
{
  "error": "Failed to generate jewelry video",
  "details": "API key not configured"
}
```

## Component Structure

### Files Created

1. **API Route**
   - `/src/app/api/generate-jewelry-video/route.ts` - Handles video generation requests

2. **Components**
   - `/src/components/admin/generate-video-form.tsx` - Form component for video configuration
   - `/src/app/collections/_components/video-generator-modal.tsx` - Modal wrapper

3. **Updated Files**
   - `/src/app/collections/page.tsx` - Added video generation UI to admin dashboard

## Environment Setup

### Required Environment Variables

```env
THE_NEW_BLACK_API_KEY=your_api_key_here
```

Get your API key from [The New Black](https://thenewblack.ai/) and add it to:
- Local: `.env.local`
- Production: Your hosting platform's environment variables (Vercel, Netlify, etc.)

## Technical Details

### Supported Jewelry Types
- Ring
- Necklace
- Bracelet
- Earrings

### Supported Metals
- Yellow Gold
- White Gold
- Rose Gold
- Platinum
- Silver

### Supported Gemstones
- Diamond
- Ruby
- Emerald
- Sapphire
- Topaz
- Amethyst
- Pearl
- Opal

### Video Specifications
- **Format**: MP4
- **Duration**: 15-30 seconds
- **Resolution**: 1080p (optimized for Instagram)
- **Aspect Ratio**: 9:16 (Reels) or 1:1 (Feed)
- **Credits**: ~2 credits per video

## Integration with Existing Features

This feature works alongside:
- **Customizer Page** (`/customizer`): For manual ring design
- **Collections Management**: Upload and organize collections
- **AI Presentations** (`/api/generate-jewelry-presentation`): Generate static images

## Performance & Limits

- **Generation Time**: 30-60 seconds per video
- **API Rate Limit**: Depends on The New Black AI tier
- **Credits System**: Each video uses ~2 API credits
- **Concurrent Requests**: Recommended max 3 simultaneous generations

## Troubleshooting

### Issue: "API key not configured"
- **Solution**: Ensure `THE_NEW_BLACK_API_KEY` is set in environment variables
- Check your hosting platform's environment variable configuration

### Issue: "Failed to generate jewelry video"
- **Solution**: Check API key validity and credits
- Verify all required fields are filled
- Check network connectivity

### Issue: Video generation timeout (>90 seconds)
- **Solution**: API may be slow or overloaded
- Try again in a few minutes
- Consider upgrading API tier for faster processing

### Issue: Video quality is poor
- **Solution**: The New Black AI quality depends on API tier
- Try different video styles (showcase typically offers best quality)
- Consider using higher quality gemstone descriptions

## Future Enhancements

Potential features to add:
- [ ] Save generated videos to database with metadata
- [ ] Video analytics (views, shares, engagement)
- [ ] Batch video generation for multiple items
- [ ] Custom music/background music options
- [ ] Video editing tools (trim, effects, filters)
- [ ] Integration with Instagram API for direct posting
- [ ] Multi-model coordination (pose variations)
- [ ] Background customization options

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review The New Black AI documentation: https://thenewblack.ai/docs
3. Check environment variables are correctly set
4. Review browser console for detailed error messages
