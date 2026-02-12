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
