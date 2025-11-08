-- Alternative: Simple table without authentication (for shared party)
-- Use this if you want everyone to see all characters without login
-- Run this INSTEAD of the other migration if you don't want authentication

CREATE TABLE IF NOT EXISTS characters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  user_id UUID, -- Optional: for future authentication support
  character_data JSONB NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_characters_uploaded_at ON characters(uploaded_at DESC);

-- Disable Row Level Security for public access
ALTER TABLE characters DISABLE ROW LEVEL SECURITY;

-- OR if you prefer to keep RLS enabled but allow public access, use these policies instead:
-- ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "Public can view all characters"
--   ON characters FOR SELECT
--   USING (true);
-- 
-- CREATE POLICY "Public can insert characters"
--   ON characters FOR INSERT
--   WITH CHECK (true);
-- 
-- CREATE POLICY "Public can update characters"
--   ON characters FOR UPDATE
--   USING (true)
--   WITH CHECK (true);
-- 
-- CREATE POLICY "Public can delete characters"
--   ON characters FOR DELETE
--   USING (true);

