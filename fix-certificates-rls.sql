-- Fix RLS policies for certificates table
-- This allows anon key to insert certificates (for initial testing)
-- Run this in Supabase SQL Editor

-- Enable RLS on certificates (if not already enabled)
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public read access for certificates" ON certificates;
DROP POLICY IF EXISTS "Authenticated users can manage certificates" ON certificates;
DROP POLICY IF EXISTS "Anyone can insert certificates" ON certificates;

-- Policy 1: Public Read (anyone can view certificates)
CREATE POLICY "Public read access for certificates" 
ON certificates FOR SELECT 
USING (true);

-- Policy 2: Anyone can insert (for easier testing with anon key)
-- Note: In production, you might want to restrict this to authenticated only
CREATE POLICY "Anyone can insert certificates"
ON certificates FOR INSERT
WITH CHECK (true);

-- Policy 3: Authenticated users can update
CREATE POLICY "Authenticated users can update certificates"
ON certificates FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Policy 4: Authenticated users can delete
CREATE POLICY "Authenticated users can delete certificates"
ON certificates FOR DELETE
USING (auth.role() = 'authenticated');

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'certificates';

-- Test query (should work now)
SELECT COUNT(*) as certificate_count FROM certificates;
