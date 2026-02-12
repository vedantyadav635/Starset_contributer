# 🚨 URGENT FIX: Create Submissions Table

## Error You're Seeing
```
Submission failed: Failed to save submission to database
```

## Why This Happens
The `submissions` table doesn't exist in your Supabase database yet. We created the backend code, but the database table needs to be created manually.

## Quick Fix (5 minutes)

### Step 1: Open Supabase Dashboard
1. Go to: https://supabase.com/dashboard
2. Click on your project: `jqucvarmrowzylcfdtvb`

### Step 2: Open SQL Editor
1. Click **"SQL Editor"** in the left sidebar
2. Click **"New Query"** button

### Step 3: Copy This SQL

Copy ALL of this SQL code:

```sql
-- Create submissions table to store all task submissions
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id VARCHAR(255) NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Audio/Image URLs (stored in Backblaze B2)
  audio_url TEXT,
  image_url TEXT,
  
  -- Text/Annotation data
  text_content TEXT,
  selected_option TEXT,
  
  -- File metadata
  file_size BIGINT,
  mime_type VARCHAR(100),
  
  -- Status tracking
  status VARCHAR(50) DEFAULT 'pending_validation',
  validation_notes TEXT,
  
  -- Timestamps
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  validated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_task_id ON submissions(task_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON submissions(submitted_at DESC);

-- Enable Row Level Security
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own submissions
CREATE POLICY "Users can view own submissions"
  ON submissions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own submissions
CREATE POLICY "Users can insert own submissions"
  ON submissions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Admins can view all submissions
CREATE POLICY "Admins can view all submissions"
  ON submissions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role_text = 'admin'
    )
  );

-- Policy: Admins can update submissions (for validation)
CREATE POLICY "Admins can update submissions"
  ON submissions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role_text = 'admin'
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_submissions_timestamp
  BEFORE UPDATE ON submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_submissions_updated_at();

-- Add comments for documentation
COMMENT ON TABLE submissions IS 'Stores all task submissions from contributors';
COMMENT ON COLUMN submissions.audio_url IS 'URL of audio file stored in Backblaze B2';
COMMENT ON COLUMN submissions.image_url IS 'URL of image file stored in Backblaze B2';
COMMENT ON COLUMN submissions.status IS 'Validation status: pending_validation, approved, rejected';
```

### Step 4: Run the SQL
1. Paste the SQL into the editor
2. Click **"Run"** button (or press Ctrl+Enter)
3. Wait for "Success. No rows returned" message

### Step 5: Verify Table Created
1. Click **"Table Editor"** in left sidebar
2. You should see a new table called **"submissions"**
3. Click on it to see the columns

### Step 6: Test Audio Submission Again
1. Go back to your app: http://localhost:5173
2. Select an audio task
3. Record and submit audio
4. Should work now! ✅

## What This Table Does

The `submissions` table stores:
- ✅ Audio file URLs (from Backblaze B2)
- ✅ Image file URLs (from Backblaze B2)
- ✅ Text/annotation data
- ✅ File metadata (size, type)
- ✅ Validation status
- ✅ Timestamps

## Security Features

- ✅ Row Level Security enabled
- ✅ Users can only see their own submissions
- ✅ Users can only insert their own submissions
- ✅ Admins can see and update all submissions

## Troubleshooting

### "relation does not exist" error
- The table wasn't created
- Make sure you ran the SQL in the correct project
- Check Table Editor to see if `submissions` table exists

### "permission denied" error
- RLS policies might be blocking
- Make sure you're logged in as the correct user
- Check that user_id matches your auth.uid()

### Still getting database errors?
1. Check Supabase logs (Logs → Database)
2. Verify the SQL ran successfully
3. Make sure you're using the correct Supabase project

## After Creating the Table

Once the table is created:
1. ✅ Audio submissions will be saved to database
2. ✅ B2 URLs will be stored (when you add B2 credentials)
3. ✅ You can view submissions in Supabase Table Editor
4. ✅ Admins can validate submissions

## Next Steps

After fixing this:
1. ✅ Set up Backblaze B2 (see `B2_SETUP_GUIDE.md`)
2. ✅ Add B2 credentials to `starset-backend/.env`
3. ✅ Test audio upload to B2

---

**Quick Summary:**
1. Open Supabase Dashboard
2. SQL Editor → New Query
3. Copy and run the SQL above
4. Verify table created
5. Test audio submission again

That's it! The error should be fixed! 🎉
