# Gem Image Upload Instructions

## Quick Start

### Step 1: Prepare Your Images
Create a folder in your project root called `gems-images`:
```
mafgems/
├── gems-images/
│   ├── morganite.jpg
│   ├── tanzanite.jpg
│   └── peridot.jpg
├── upload-gems.js
└── ...
```

**Image Requirements:**
- **Names:** Must be exactly `morganite`, `tanzanite`, `peridot` (without extension)
- **Formats:** Supports .jpg, .jpeg, .png, .webp
- **Size:** Recommended 80x80px to 200x200px for gallery
- **Quality:** High quality images recommended

### Step 2: Run the Upload Script
```bash
node upload-gems.js
```

### Step 3: What It Does
The script will:
1. ✅ Read images from `gems-images` folder
2. ✅ Upload them to Supabase Storage (`gems` bucket)
3. ✅ Insert gem records into your `gems` database table
4. ✅ Display success messages with image URLs

### Step 4: Verify
- Refresh your browser
- Go to "Jewelry Customizer"
- You should see all 15 gems in the gallery, including the 3 new ones with real images!

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in `.env.local`
- They should already be there from your Netlify setup

### Error: "Folder not found: gems-images"
- Create the `gems-images` folder in your project root (same level as `package.json`)
- Place your 3 gem images there

### Script runs but no images appear in database
- Check Supabase Storage: The bucket might need to be created manually
- In Supabase Dashboard → Storage → Create a new bucket named `gems`
- Make sure the bucket is set to **Public**

## Manual Alternative
If the script doesn't work, you can manually:
1. Upload images to Supabase Storage (gems bucket)
2. Copy the public URLs
3. Insert records into the `gems` table with:
   ```sql
   INSERT INTO gems (name, color, image_url) VALUES
   ('Morganite', '#FF99CC', 'YOUR_IMAGE_URL'),
   ('Tanzanite', '#0047AB', 'YOUR_IMAGE_URL'),
   ('Peridot', '#E8FF00', 'YOUR_IMAGE_URL');
   ```

## Need Help?
The script will provide detailed output showing:
- Which images are being uploaded
- Public URLs for each image
- Success/failure status for each gem
- Database insertion results
