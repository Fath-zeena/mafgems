#!/usr/bin/env node

/**
 * Create common app tables if they are missing.
 * Uses .env.local and SUPABASE_SERVICE_ROLE_KEY. This script will NOT
 * DROP anything; it only runs CREATE TABLE IF NOT EXISTS and light policy setup.
 */
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function run() {
  try {
    console.log('Running safe CREATE TABLE IF NOT EXISTS for known tables...');

    const sql = `
    -- Collections
    CREATE TABLE IF NOT EXISTS public.collections (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      price NUMERIC DEFAULT 0,
      image_urls TEXT[]
    );

    -- Products
    CREATE TABLE IF NOT EXISTS public.products (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
      collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL,
      title TEXT NOT NULL,
      description TEXT,
      price NUMERIC DEFAULT 0,
      sku TEXT,
      image_urls TEXT[],
      metadata JSONB
    );

    -- Gems
    CREATE TABLE IF NOT EXISTS public.gems (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
      name TEXT NOT NULL,
      sku TEXT,
      model3d_url TEXT,
      video_urls TEXT[],
      price NUMERIC DEFAULT 0,
      metadata JSONB
    );

    -- Jewelry videos
    CREATE TABLE IF NOT EXISTS public.jewelry_videos (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
      user_id UUID,
      gem_id UUID REFERENCES public.gems(id) ON DELETE SET NULL,
      url TEXT,
      provider TEXT,
      status TEXT DEFAULT 'created'
    );

    -- User designs
    CREATE TABLE IF NOT EXISTS public.user_designs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
      user_id UUID,
      design JSONB
    );

    -- Enable RLS where appropriate
    ALTER TABLE IF EXISTS public.collections ENABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS public.products ENABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS public.gems ENABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS public.jewelry_videos ENABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS public.user_designs ENABLE ROW LEVEL SECURITY;

    -- Basic read policy for collections/products/gems (public SELECT)
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policy p WHERE p.polname = 'public_read_collections'
      ) THEN
        CREATE POLICY public_read_collections ON public.collections FOR SELECT USING (true);
      END IF;
    END $$;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policy p WHERE p.polname = 'public_read_products'
      ) THEN
        CREATE POLICY public_read_products ON public.products FOR SELECT USING (true);
      END IF;
    END $$;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policy p WHERE p.polname = 'public_read_gems'
      ) THEN
        CREATE POLICY public_read_gems ON public.gems FOR SELECT USING (true);
      END IF;
    END $$;

    `;

    const { data, error } = await supabase.rpc('exec_sql', { sql });
    if (error) {
      console.error('RPC exec_sql failed:', error.message || error);
      console.error('If your project does not expose exec_sql RPC, run the following SQL manually in Supabase SQL Editor:');
      console.log(sql);
      process.exit(1);
    }

    console.log('SQL executed via RPC; check Supabase dashboard to confirm table creation.');

    // sanity checks
    const checks = [
      { table: 'collections' },
      { table: 'products' },
      { table: 'gems' },
      { table: 'jewelry_videos' },
      { table: 'user_designs' },
    ];

    for (const c of checks) {
      const { data: rows, error: selErr } = await supabase.from(c.table).select('id').limit(1);
      if (selErr) {
        console.warn(`Check failed for ${c.table}:`, selErr.message || selErr);
      } else {
        console.log(`Table ${c.table} is present (select succeeded).`);
      }
    }

    console.log('Done.');
    process.exit(0);

  } catch (err) {
    console.error('Unexpected error:', err.message || err);
    process.exit(1);
  }
}

run();
