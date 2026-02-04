# Updated Supabase Setup Instructions

## 1. Create SQL Functions & Triggers

To enable the "Max 3 Admins" security feature, you must add this function to your Supabase database. Go to **SQL Editor** and run:

```sql
-- Function to count users in the auth schema
create or replace function get_admin_count()
returns integer
security definer
as $$
begin
  return (select count(*) from auth.users);
end;
$$ language plpgsql;

-- Grant access to public (or authenticated) so the sign-up page can check it
-- Note: In a stricter env, you might restrict this, but for this workflow it's needed
grant execute on function get_admin_count to anon, authenticated, service_role;
```

## 2. Environment Variables

Add your Admin Secret Code to `.env.local` to secure the registration form:

```
NEXT_PUBLIC_ADMIN_SECRET=MAFGEMS_ADMIN_2026
```

*(If you don't set this, the default will be `MAFGEMS_ADMIN_2026`)*

## 3. (If not done) Previous Setup
Make sure you ran the previous SQL to create the `collections` table!

```sql
create table if not exists collections (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  price numeric default 0,
  image_urls text[]
);
alter table collections enable row level security;
create policy "Public collections are viewable by everyone" on collections for select using ( true );
create policy "Admins can manage collections" on collections for all using ( auth.role() = 'authenticated' );
```
