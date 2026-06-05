-- Run this in your Supabase SQL Editor to fix the RLS policies for your existing tables!
-- It looks like you already had the `packs` and `presets` tables created manually.
-- These commands will ensure you (and any signed-in user) can actually READ and WRITE to them.

-- 1. Enable RLS on the packs and presets tables if not already enabled
ALTER TABLE public.packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.presets ENABLE ROW LEVEL SECURITY;

-- 2. Drop any existing policies that might be blocking access (Optional but recommended for a clean slate)
DROP POLICY IF EXISTS "Users can view their own packs" ON public.packs;
DROP POLICY IF EXISTS "Users can create their own packs" ON public.packs;
DROP POLICY IF EXISTS "Users can update their own packs" ON public.packs;
DROP POLICY IF EXISTS "Users can delete their own packs" ON public.packs;

DROP POLICY IF EXISTS "Users can view their own presets" ON public.presets;
DROP POLICY IF EXISTS "Users can create their own presets" ON public.presets;
DROP POLICY IF EXISTS "Users can update their own presets" ON public.presets;
DROP POLICY IF EXISTS "Users can delete their own presets" ON public.presets;


-- 3. Create fresh policies for 'packs'
CREATE POLICY "Users can view their own packs" 
  ON public.packs FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own packs" 
  ON public.packs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own packs" 
  ON public.packs FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own packs" 
  ON public.packs FOR DELETE 
  USING (auth.uid() = user_id);


-- 4. Create fresh policies for 'presets'
CREATE POLICY "Users can view their own presets" 
  ON public.presets FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own presets" 
  ON public.presets FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own presets" 
  ON public.presets FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own presets" 
  ON public.presets FOR DELETE 
  USING (auth.uid() = user_id);
