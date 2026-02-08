# Generate AI Jewellery Presentations - Setup & Testing Guide

## Overview
Your "Generate AI Jewellery Presentations" feature is now fully integrated with The New Black AI API. This guide covers setup, database configuration, and testing.

---

## 1. Environment Variables ✅

Your `.env.local` file is already configured with:
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - Supabase instance
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Supabase authentication
- ✅ `THE_NEW_BLACK_API_KEY` - The New Black AI API access

No additional configuration needed here.

---

## 2. Database Setup

### Create Supabase Table

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **SQL Editor**
4. Copy and paste the entire contents of `DATABASE_SETUP.sql`
5. Click **Run** to create the table and policies

This will create:
- `presentation_generations` table to store all generated presentations
- Proper indexes for performance
- Row-level security policies
- Auto-update timestamp triggers

### Table Structure
```
presentation_generations
├── id (UUID, Primary Key)
├── user_id (UUID, Foreign Key to auth.users)
├── input_method (text: text-to-image, text-to-video, etc.)
├── jewelry_type (text: ring, necklace, bracelet, etc.)
├── output_type (text: image, video, 3d)
├── output_url (text: URL to generated file)
├── status (text: pending, processing, completed, failed)
├── configuration (jsonb: full config object)
├── created_at (timestamp)
└── updated_at (timestamp)
```

---

## 3. Features Implemented

### ✨ 1. Error Handling Improvements
**File:** `src/app/api/generate-presentation/route.ts`

Enhanced error handling includes:
- Input validation with specific error messages
- Network timeout handling (120 second limit)
- Detailed API error responses with status codes
- Fallback messages for different HTTP error codes
- Database save failures don't break the user experience
- Console logging for debugging

**Error Responses Include:**
- 400: Bad request with parameter details
- 401: Authentication failure
- 403: Permission denied
- 404: Invalid workflow
- 429: Rate limiting
- 500+: Server errors
- Network timeouts with retry suggestions

### ✨ 2. Image Upload Functionality
**File:** `src/app/presentation/page.tsx`

Enhanced image upload with:
- File size validation (max 10MB)
- File type validation (images only)
- DataURL conversion for preview and API submission
- User feedback via toast notifications
- Error handling for failed uploads
- Drag-and-drop ready structure

**Supported Formats:**
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- GIF (.gif)
- SVG (.svg)

### ✨ 3. Supabase Table Tracking
**File:** `DATABASE_SETUP.sql`

Automatic tracking of all presentations:
- Every generation is saved to the database
- User-specific data with row-level security
- Timestamp tracking (created_at, updated_at)
- Configuration stored as JSON for reproducibility
- Status tracking (pending, processing, completed, failed)
- Searchable/filterable by input method, jewelry type, output type

### ✨ 4. Presentation Gallery Component
**File:** `src/components/presentation-gallery.tsx`

Full-featured gallery showing:
- Grid display of all user presentations
- Live preview on hover
- Full-screen viewer modal
- Download functionality
- Share functionality (native share or copy to clipboard)
- Delete functionality with confirmation
- Loading states and error handling
- Empty state with CTA to create first presentation

---

## 4. Testing the Feature

### Test 1: Text to Image
1. Navigate to `/presentation`
2. Select "Text to Image" input method
3. Enter prompt: "A beautiful diamond ring with intricate gold band"
4. Keep default settings
5. Click **Create Presentation**
6. Should generate and display an image ✅

### Test 2: Text to Video
1. Select "Text to Video"
2. Enter prompt: "An elegant pearl necklace rotating slowly"
3. Set Duration: 15 seconds
4. Click **Create Presentation**
5. Should generate and display a video ✅

### Test 3: Image to Video
1. Upload a reference image (JPG/PNG)
2. Select "Image to Video"
3. Set video style to "Rotate"
4. Click **Create Presentation**
5. Should generate video from image ✅

### Test 4: Workflow Configuration
1. Fill all fields:
   - Input method: Text to Image
   - Prompt: "Rose gold bracelet with emeralds"
   - Jewelry type: Bracelet
   - Model profile: Side View
   - Background: Studio Gradient
   - Style: Photorealistic
   - Lighting: Studio
   - Detail level: 8/10
2. Click **Create Presentation** ✅

### Test 5: Database Saving
1. Log in with a user account
2. Generate a presentation
3. Check that it appears in your gallery
4. Verify data in Supabase:
   - Go to Supabase → Table Editor
   - Select `presentation_generations`
   - Your presentation should be listed ✅

### Test 6: Gallery Features
1. Generate multiple presentations
2. Go to dashboard or gallery section
3. Test:
   - Hover to see preview
   - Click View to open modal
   - Download presentation
   - Share presentation
   - Delete presentation ✅

---

## 5. Integration with Dashboard

To add the gallery to your dashboard:

```tsx
// In src/app/dashboard/page.tsx
import { PresentationGallery } from "@/components/presentation-gallery";

export default function DashboardPage() {
  return (
    <div>
      {/* existing content */}
      <h2>AI Presentations</h2>
      <PresentationGallery />
    </div>
  );
}
```

---

## 6. API Reference

### Generate Presentation Endpoint

**POST** `/api/generate-presentation`

**Request Body:**
```json
{
  "inputMethod": "text-to-image",
  "textPrompt": "A diamond ring...",
  "imageUrl": null,
  "jewelryType": "ring",
  "modelProfile": "frontal",
  "background": "studio",
  "outfitConfig": "single-item",
  "outputFormat": "render",
  "styleReference": "photorealistic",
  "colorPalette": "vibrant",
  "resolution": "1024",
  "detailLevel": 7,
  "lightingStyle": "studio",
  "videoDuration": "30",
  "frameRate": "30",
  "videoStyle": "rotate",
  "modelBodyType": "medium",
  "skinTone": "medium",
  "iterationMode": "single",
  "userId": "uuid-optional"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "outputUrl": "https://...",
  "outputType": "image|video|3d",
  "inputMethod": "text-to-image",
  "jewelryType": "ring",
  "configuration": { /* full config */ }
}
```

**Error Response:**
```json
{
  "error": "Specific error message",
  "details": "Optional details"
}
```

---

## 7. Environment Variables Checklist

- [x] `NEXT_PUBLIC_SUPABASE_URL` = `https://awnihpkyjmycjehgsnzo.supabase.co`
- [x] `SUPABASE_SERVICE_ROLE_KEY` = Your service role key
- [x] `THE_NEW_BLACK_API_KEY` = Your API key
- [ ] Supabase table created via DATABASE_SETUP.sql

---

## 8. Troubleshooting

### "API returned invalid response"
- Verify `THE_NEW_BLACK_API_KEY` is valid
- Check API rate limits
- Ensure workflow name is correct

### "Network error" / Timeout
- Check internet connection
- API is taking too long (120s timeout)
- Try with simpler parameters first

### "Failed to parse API response"
- API returned non-JSON response
- Check The New Black AI API documentation
- Try with different input method

### Presentations not saving to database
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
- Check table exists: `SELECT * FROM presentation_generations;`
- Verify user is logged in (userId being passed)
- Check Supabase RLS policies are enabled

### Image upload not working
- File size exceeds 10MB
- File type not an image
- Browser doesn't support FileReader API

---

## 9. Performance Optimization

The gallery component includes:
- Lazy loading of images
- Optimized queries with proper indexes
- Pagination ready (can be added)
- Caching strategies

For high volume:
1. Add pagination to gallery
2. Implement image compression
3. Use CDN for serving generated files
4. Archive old presentations

---

## 10. Next Steps

1. ✅ Run `DATABASE_SETUP.sql` in Supabase
2. ✅ Test all 6 test scenarios above
3. ✅ Add `PresentationGallery` component to dashboard
4. ✅ Monitor API usage in The New Black AI dashboard
5. ✅ Collect user feedback
6. Optional: Add pagination, export features, sharing links

---

## 11. Monitoring & Logging

Check console logs for:
- `[API]` - API calls and workflows
- `[Generation Success]` - Successful generations
- `[Generation Error]` - User-facing errors
- `[Database Save Error]` - DB issues (non-blocking)

---

## Support

For issues:
1. Check Supabase logs: Dashboard → Logs
2. Check browser console for error details
3. Review API response in Network tab
4. Check The New Black AI API status

Enjoy your new AI Jewellery Presentation Generator! 🎉
