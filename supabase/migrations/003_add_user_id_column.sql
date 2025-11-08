-- Migration to add user_id column to existing characters table
-- Run this if you already created the table without user_id

-- Add user_id column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'characters' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE characters ADD COLUMN user_id UUID;
  END IF;
END $$;

-- Add index for user_id if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_characters_user_id ON characters(user_id);

