# Supabase Setup Instructions

To enable the Admin Collections functionality, you need to set up your Supabase project as follows:

## 1. Create Storage Bucket

1.  Go to **Storage** in your Supabase Dashboard.
2.  Create a new bucket named `collections`.
3.  Set it to **Public**.
4.  Add a policy to allow authenticated users (Admins) to upload/delete:
    *   Operation: INSERT, UPDATE, DELETE
    *   Target role: `authenticated`
5.  Add a policy to allow anyone to read (SELECT):
    *   Target role: `anon` (public)

## 2. Create Database Table

Run the following SQL in your Supabase **SQL Editor**:

```sql
create table if not exists collections (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  price numeric default 0,
  image_urls text[] -- Array of image URLs
);

-- Enable Row Level Security (RLS)
alter table collections enable row level security;

-- Policy: Anyone can view collections
create policy "Public collections are viewable by everyone"
  on collections for select
  using ( true );

-- Policy: Only authenticated users (Admins) can insert/update/delete
create policy "Admins can manage collections"
  on collections for all
  using ( auth.role() = 'authenticated' );
```

## 3. Environment Variables
Ensure your `.env.local` has:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```
