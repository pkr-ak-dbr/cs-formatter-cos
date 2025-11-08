-- Supabase SQL Migration for D&D Character Viewer
-- Run this in your Supabase SQL Editor

-- Characters table
CREATE TABLE IF NOT EXISTS characters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  character_data JSONB NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_characters_user_id ON characters(user_id);
CREATE INDEX IF NOT EXISTS idx_characters_uploaded_at ON characters(uploaded_at DESC);

-- Enable Row Level Security
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own characters
CREATE POLICY "Users can view their own characters"
  ON characters FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own characters
CREATE POLICY "Users can insert their own characters"
  ON characters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own characters
CREATE POLICY "Users can update their own characters"
  ON characters FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own characters
CREATE POLICY "Users can delete their own characters"
  ON characters FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_characters_updated_at
  BEFORE UPDATE ON characters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Optional: If you want to allow anonymous/public access (for shared party view)
-- Uncomment the following policies:

-- Policy: Allow public read access (optional - for shared party)
-- CREATE POLICY "Public can view all characters"
--   ON characters FOR SELECT
--   USING (true);

-- Policy: Allow public insert (optional - for anonymous uploads)
-- CREATE POLICY "Public can insert characters"
--   ON characters FOR INSERT
--   WITH CHECK (true);

-- Policy: Allow public delete (optional - be careful with this!)
-- CREATE POLICY "Public can delete characters"
--   ON characters FOR DELETE
--   USING (true);

