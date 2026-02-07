#!/usr/bin/env node
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

async function checkTable(table) {
  try {
    const { data, error } = await supabase.from(table).select('id').limit(1);
    if (error) {
      console.log(`${table}: ERROR -> ${error.message || JSON.stringify(error)}`);
      return { table, ok: false, error };
    }
    const count = Array.isArray(data) ? data.length : 0;
    console.log(`${table}: OK — rows returned: ${count}`);
    return { table, ok: true, rows: count };
  } catch (err) {
    console.log(`${table}: EXCEPTION -> ${err.message}`);
    return { table, ok: false, error: err };
  }
}

async function run() {
  const tables = ['collections','products','gems','jewelry_videos','user_designs'];
  for (const t of tables) {
    // eslint-disable-next-line no-await-in-loop
    await checkTable(t);
  }
  process.exit(0);
}

run();
