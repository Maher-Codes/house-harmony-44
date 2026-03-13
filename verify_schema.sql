-- verify_schema.sql
-- This script safely creates or verifies exactly the requested tables and enables permissive RLS for both anon and authenticated users on each.

-- 1. houses
CREATE TABLE IF NOT EXISTS public.houses (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  house_code text not null unique,
  created_at timestamp with time zone default now() not null
);
ALTER TABLE public.houses ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Permissive anon houses" ON public.houses FOR ALL TO anon USING (true) WITH CHECK (true);
  CREATE POLICY "Permissive authenticated houses" ON public.houses FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. members
CREATE TABLE IF NOT EXISTS public.members (
  id uuid default gen_random_uuid() primary key,
  house_id uuid references public.houses(id) on delete cascade not null,
  name text not null,
  created_at timestamp with time zone default now() not null
);
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Permissive anon members" ON public.members FOR ALL TO anon USING (true) WITH CHECK (true);
  CREATE POLICY "Permissive authenticated members" ON public.members FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 3. clean_records
CREATE TABLE IF NOT EXISTS public.clean_records (
  id uuid default gen_random_uuid() primary key,
  house_id uuid references public.houses(id) on delete cascade not null,
  member_id uuid references public.members(id) on delete cascade not null,
  date date not null,
  created_at timestamp with time zone default now() not null
);
ALTER TABLE public.clean_records ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Permissive anon clean_records" ON public.clean_records FOR ALL TO anon USING (true) WITH CHECK (true);
  CREATE POLICY "Permissive authenticated clean_records" ON public.clean_records FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 4. purchases
CREATE TABLE IF NOT EXISTS public.purchases (
  id uuid default gen_random_uuid() primary key,
  house_id uuid references public.houses(id) on delete cascade not null,
  member_id uuid references public.members(id) on delete cascade not null,
  item_name text not null,
  date date not null,
  created_at timestamp with time zone default now() not null
);
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Permissive anon purchases" ON public.purchases FOR ALL TO anon USING (true) WITH CHECK (true);
  CREATE POLICY "Permissive authenticated purchases" ON public.purchases FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 5. supply_responsibilities
CREATE TABLE IF NOT EXISTS public.supply_responsibilities (
  id uuid default gen_random_uuid() primary key,
  house_id uuid references public.houses(id) on delete cascade not null,
  item_name text not null,
  next_member_id uuid references public.members(id) on delete cascade not null,
  created_at timestamp with time zone default now() not null,
  UNIQUE(house_id, item_name)
);
ALTER TABLE public.supply_responsibilities ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Permissive anon supply_responsibilities" ON public.supply_responsibilities FOR ALL TO anon USING (true) WITH CHECK (true);
  CREATE POLICY "Permissive authenticated supply_responsibilities" ON public.supply_responsibilities FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 6. house_settings
CREATE TABLE IF NOT EXISTS public.house_settings (
  id uuid default gen_random_uuid() primary key,
  house_id uuid references public.houses(id) on delete cascade not null,
  supplies jsonb default '[]'::jsonb not null,
  cleaning_enabled boolean default true not null,
  cleaning_frequency text default 'weekly' not null,
  cleaning_day integer default 6 not null,
  rotation_type text default 'round_robin' not null,
  created_at timestamp with time zone default now() not null,
  UNIQUE(house_id)
);
ALTER TABLE public.house_settings ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Permissive anon house_settings" ON public.house_settings FOR ALL TO anon USING (true) WITH CHECK (true);
  CREATE POLICY "Permissive authenticated house_settings" ON public.house_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

