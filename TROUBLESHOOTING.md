# Troubleshooting: Can't Save Characters on Vercel

If you're unable to save characters on your Vercel deployment, follow these steps:

## Step 1: Check Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Verify these are set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Make sure they're set for **Production**, **Preview**, and **Development**
5. **Redeploy** after adding/changing environment variables

## Step 2: Verify Supabase Table Exists

1. Go to your Supabase dashboard
2. Navigate to **Table Editor**
3. Check if the `characters` table exists
4. If not, run the SQL migration:
   - Go to **SQL Editor**
   - Copy and paste the contents of `supabase/migrations/002_create_characters_table_public.sql`
   - Click **Run**

## Step 3: Check Row Level Security (RLS)

If you're using the **public migration** (no authentication):

1. Go to Supabase dashboard → **Table Editor** → `characters` table
2. Click on **Policies** tab
3. If you see RLS is **Enabled**, you need to either:
   
   **Option A: Disable RLS** (easiest for public access):
   ```sql
   ALTER TABLE characters DISABLE ROW LEVEL SECURITY;
   ```
   
   **Option B: Create public policies** (run this in SQL Editor):
   ```sql
   ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
   
   CREATE POLICY "Public can view all characters"
     ON characters FOR SELECT
     USING (true);
   
   CREATE POLICY "Public can insert characters"
     ON characters FOR INSERT
     WITH CHECK (true);
   
   CREATE POLICY "Public can update characters"
     ON characters FOR UPDATE
     USING (true)
     WITH CHECK (true);
   
   CREATE POLICY "Public can delete characters"
     ON characters FOR DELETE
     USING (true);
   ```

## Step 4: Check Browser Console

1. Open your deployed site
2. Open browser DevTools (F12)
3. Go to **Console** tab
4. Try uploading a character
5. Look for error messages - they will now show specific details

## Common Error Messages

### "Database permission error" or "Row Level Security"
- **Fix**: Run Step 3 above to disable RLS or create public policies

### "Database table not found" or "relation does not exist"
- **Fix**: Run the SQL migration in Step 2

### "Authentication error" or "JWT"
- **Fix**: Check your environment variables in Step 1

### "Supabase client not initialized"
- **Fix**: Environment variables are missing or incorrect

## Quick Fix Script

Run this in your Supabase SQL Editor to fix the most common issue:

```sql
-- Drop existing policies if any
DROP POLICY IF EXISTS "Public can view all characters" ON characters;
DROP POLICY IF EXISTS "Public can insert characters" ON characters;
DROP POLICY IF EXISTS "Public can update characters" ON characters;
DROP POLICY IF EXISTS "Public can delete characters" ON characters;
DROP POLICY IF EXISTS "Users can view their own characters" ON characters;
DROP POLICY IF EXISTS "Users can insert their own characters" ON characters;
DROP POLICY IF EXISTS "Users can update their own characters" ON characters;
DROP POLICY IF EXISTS "Users can delete their own characters" ON characters;

-- Disable RLS for public access
ALTER TABLE characters DISABLE ROW LEVEL SECURITY;
```

## Still Not Working?

1. Check Vercel deployment logs for errors
2. Verify your Supabase project is active (not paused)
3. Check Supabase logs: Dashboard → **Logs** → **Postgres Logs**
4. Make sure you're using the correct Supabase project URL and key

