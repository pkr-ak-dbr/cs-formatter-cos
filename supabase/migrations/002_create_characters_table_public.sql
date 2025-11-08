-- Alternative: Simple table without authentication (for shared party)
-- Use this if you want everyone to see all characters without login
-- Run this INSTEAD of the other migration if you don't want authentication

CREATE TABLE IF NOT EXISTS characters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  character_data JSONB NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_characters_uploaded_at ON characters(uploaded_at DESC);

-- No RLS needed for public access
-- All users can read/write (be careful in production!)

