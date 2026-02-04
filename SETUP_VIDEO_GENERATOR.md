# Quick Setup: Jewelry Video Generator

## Step 1: Get New Black AI API Key
1. Visit https://thenewblack.ai/api
2. Sign up or log in
3. Create an API key
4. Copy the key

## Step 2: Configure Environment
Add to `.env.local`:
```env
THE_NEW_BLACK_API_KEY=sk_xxxxxxxxxxxx
```

## Step 3: Restart Dev Server
```bash
npm run dev
```

## Step 4: Access the Feature
1. Navigate to `http://localhost:3000/collections`
2. Log in as admin
3. Click "Videos" tab
4. Click "Create Video"

## Testing Credentials
For testing, you can use the mock data in the component. The gallery will show:
- A sample "Blue Sapphire Ring" video
- Status badges and action buttons

## Environment Checklist
- [ ] `.env.local` file created
- [ ] `THE_NEW_BLACK_API_KEY` added
- [ ] Dev server restarted
- [ ] Can access `/collections` as admin
- [ ] "Videos" tab is visible
- [ ] "Create Video" button works

## What Happens Next?
1. Click "Create Video" in Collections > Videos tab
2. Fill in jewelry details (gem name, metal, type, etc.)
3. Choose style (model style, background, etc.)
4. Add brand name and hashtags
5. Click "Create Video"
6. Video generation starts (~30-60 seconds)
7. Video appears in gallery when ready
8. Download or share to Instagram

## File Locations
- **Component**: `src/components/admin/jewelry-video-generator.tsx`
- **API Route**: `src/app/api/generate-jewelry-video/route.ts`
- **Page Integration**: `src/app/collections/page.tsx`
- **Docs**: `JEWELRY_VIDEO_GENERATOR.md`

## Support
Refer to `JEWELRY_VIDEO_GENERATOR.md` for:
- Detailed feature documentation
- API reference
- Troubleshooting
- Future enhancements
- Security guidelines
