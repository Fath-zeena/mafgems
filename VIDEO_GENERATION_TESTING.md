# Jewelry Video Generation - Setup & Testing Guide

## Quick Setup

### 1. Configure Environment Variables

Add to your `.env.local` (development) or platform environment variables (production):

```env
THE_NEW_BLACK_API_KEY=your_actual_api_key_here
```

### 2. Test the Feature

#### Step 1: Start the Development Server
```bash
npm run dev
```

#### Step 2: Access Admin Collections
- Navigate to `http://localhost:3000/collections`
- Click "Admin Login" if not logged in
- Enter admin credentials

#### Step 3: Test Video Generation (Global)
- Click "Generate Instagram Video" button (top right)
- Fill in the form:
  - Jewelry Type: Ring
  - Gemstone: Sapphire
  - Gem Color: Blue
  - Metal: White Gold
  - Video Style: Showcase
  - Model Preference: Diverse Models Mix
- Click "Generate Instagram Video"
- Wait 30-60 seconds for generation
- Preview, copy, download, or share the video

#### Step 4: Test Collection-Specific Video
- Scroll to any collection
- Click "Generate Video" button on the collection card
- The collection name will be pre-filled
- Configure other settings and generate

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── generate-jewelry-video/
│   │       └── route.ts                    # API endpoint
│   └── collections/
│       ├── page.tsx                        # Updated with video UI
│       └── _components/
│           └── video-generator-modal.tsx   # Modal component
├── components/
│   └── admin/
│       └── generate-video-form.tsx         # Form component
```

## Key Features Implemented

### 1. **Video Generation Modal**
- Clean, professional dialog interface
- Pre-fills collection name when generating from collection card
- Shows loading state during generation

### 2. **Form Configuration**
- 8 gemstone options (Diamond, Ruby, Emerald, Sapphire, Topaz, Amethyst, Pearl, Opal)
- 8 color options (White, Blue, Red, Green, Yellow, Purple, Pink, Gold)
- 5 metal options (White Gold, Yellow Gold, Rose Gold, Platinum, Silver)
- 3 video style options (Showcase, Detailed, Lifestyle)
- 3 model preference options (Female, Male, Diverse)
- Optional custom description field

### 3. **Video Preview & Actions**
After generation, users can:
- ✅ Preview video (with autoplay and loop)
- ✅ Copy video URL
- ✅ Download as MP4
- ✅ Share on Instagram
- ✅ Generate another video

### 4. **Admin Dashboard Integration**
- New standalone "Generate Instagram Video" button
- Per-collection "Generate Video" button
- Beautiful modal interface

## Testing Checklist

### Form Validation
- [ ] Form requires gemstone selection
- [ ] All required fields have proper dropdown options
- [ ] Custom description field is optional
- [ ] Submit button shows loading state

### API Integration
- [ ] API endpoint receives correct payload
- [ ] Error handling displays user-friendly messages
- [ ] Success response returns video URL

### Video Actions
- [ ] Preview plays the generated video
- [ ] Copy button copies URL to clipboard
- [ ] Download button saves MP4 file
- [ ] Share button opens Instagram dialog
- [ ] "Generate Another" resets form

### UI/UX
- [ ] Modal opens/closes smoothly
- [ ] Form fields are clearly labeled
- [ ] Success state shows video details
- [ ] Loading spinners appear during generation
- [ ] Responsive design works on mobile

## Example API Request/Response

### Request
```json
{
  "collectionTitle": "Emerald Dreams",
  "gemName": "Emerald",
  "gemColor": "green",
  "metalColor": "yellow_gold",
  "jewelryType": "ring",
  "modelPreference": "diverse",
  "videoStyle": "showcase"
}
```

### Response
```json
{
  "success": true,
  "jewelryType": "ring",
  "gemName": "Emerald",
  "collectionTitle": "Emerald Dreams",
  "metalColor": "yellow_gold",
  "videoUrl": "https://api.example.com/videos/emerald-ring-123.mp4",
  "videoId": "vid_abc123",
  "generationId": "gen_xyz789",
  "creditsUsed": 2,
  "thumbnailUrl": "https://api.example.com/thumbs/emerald-ring-123.jpg",
  "duration": "20 seconds",
  "status": "completed"
}
```

## Performance Metrics

| Metric | Value |
|--------|-------|
| Generation Time | 30-60 seconds |
| Video Duration | 15-30 seconds |
| File Size | 5-15 MB (estimated) |
| API Credits | ~2 per video |
| Supported Formats | MP4 |
| Resolution | 1080p |

## Troubleshooting

### Video Won't Generate
1. Check THE_NEW_BLACK_API_KEY is set correctly
2. Verify API key has active credits
3. Check network tab in DevTools for API response
4. Look for error messages in browser console

### Video Quality Issues
1. Try different video style (Showcase recommended)
2. Ensure gemstone and metal colors are specified
3. Check API tier for quality limits
4. Try with different gemstone options

### Modal Won't Open
1. Verify `video-generator-modal.tsx` is in correct directory
2. Check imports in collections/page.tsx
3. Verify no TypeScript errors with `npm run build`

### Can't Download Video
1. Check browser download settings
2. Verify pop-up blockers aren't preventing download
3. Try right-click → "Save video as"

## Next Steps

After verifying the feature works:

1. **Save Videos to Database**
   - Store generated video URLs in Supabase
   - Track video metadata (creation date, likes, shares)

2. **Integrate with Collections**
   - Attach generated videos to collection records
   - Display videos in collection gallery

3. **Analytics Dashboard**
   - Track video generation history
   - Monitor API credit usage
   - Display engagement metrics

4. **Batch Operations**
   - Generate videos for multiple items
   - Schedule video generation
   - Template-based generation

5. **Advanced Features**
   - Custom backgrounds
   - Background music options
   - Effects and transitions
   - Direct Instagram API integration

## Support & Documentation

- The New Black AI Docs: https://thenewblack.ai/docs
- API Key Management: https://thenewblack.ai/dashboard
- Video Standards: https://help.instagram.com/1631821640426723

## Notes for Developers

- The form component handles all UI logic
- Modal provides the dialog wrapper
- API route handles The New Black AI integration
- Collections page orchestrates modal state
- All components are fully typed with TypeScript

