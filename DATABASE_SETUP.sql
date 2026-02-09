-- Create presentation_generations table to track all generated presentations
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS presentation_generations (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User reference
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Generation metadata
  input_method TEXT NOT NULL,
  jewelry_type TEXT NOT NULL,
  output_type TEXT NOT NULL CHECK (output_type IN ('image', 'video', '3d')),
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  
  -- Output URL
  output_url TEXT NOT NULL,
  
  -- Full configuration (for reproducibility)
  configuration JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexing for performance
  CONSTRAINT user_created_idx UNIQUE(user_id, created_at)
);

-- Create indexes for better query performance
CREATE INDEX idx_presentation_generations_user_id ON presentation_generations(user_id);
CREATE INDEX idx_presentation_generations_created_at ON presentation_generations(created_at DESC);
CREATE INDEX idx_presentation_generations_input_method ON presentation_generations(input_method);
CREATE INDEX idx_presentation_generations_jewelry_type ON presentation_generations(jewelry_type);
CREATE INDEX idx_presentation_generations_status ON presentation_generations(status);

-- Create policies for Row Level Security (RLS)
ALTER TABLE presentation_generations ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own presentations
CREATE POLICY "Users can view their own presentations" 
  ON presentation_generations 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Allow users to create presentations
CREATE POLICY "Users can create presentations" 
  ON presentation_generations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own presentations
CREATE POLICY "Users can update their own presentations" 
  ON presentation_generations 
  FOR UPDATE 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own presentations
CREATE POLICY "Users can delete their own presentations" 
  ON presentation_generations 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function
CREATE TRIGGER update_presentation_generations_updated_at
BEFORE UPDATE ON presentation_generations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
