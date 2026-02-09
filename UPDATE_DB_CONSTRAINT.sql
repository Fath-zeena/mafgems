-- Update presentation_generations table to support new jewelry design input methods
-- Run these commands in Supabase SQL Editor: https://app.supabase.com → SQL Editor → New Query

-- Step 1: Drop the old constraint
ALTER TABLE presentation_generations 
DROP CONSTRAINT presentation_generations_input_method_check;

-- Step 2: Add the new constraint with all supported input methods
ALTER TABLE presentation_generations 
ADD CONSTRAINT presentation_generations_input_method_check 
CHECK (input_method IN (
  'text-to-image',
  'text-to-video', 
  'image-to-video',
  'image-to-3d',
  'text-to-3d',
  'ring-design',
  'necklace-design',
  'bracelet-design',
  'earrings-design',
  'ai-video'
));

-- Verification: Check that constraint was created
SELECT constraint_name, constraint_definition
FROM information_schema.table_constraints
WHERE table_name = 'presentation_generations' AND constraint_name LIKE '%input_method%';
