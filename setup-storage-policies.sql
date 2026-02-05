-- Create gallery storage bucket and set up policies
-- Run this in Supabase SQL Editor

-- First, create the bucket (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('gallery', 'gallery', true, 52428800, ARRAY['image/*'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload to gallery" ON storage.objects;

-- Policy 1: Public Read Access (anyone can view images)
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');

-- Policy 2: Anyone can upload to gallery (for initial setup)
CREATE POLICY "Anyone can upload to gallery"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'gallery');

-- Policy 3: Authenticated users can delete
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');

-- Policy 4: Authenticated users can update
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'gallery' AND auth.role() = 'authenticated')
WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'objects' AND schemaname = 'storage';

-- Check bucket
SELECT * FROM storage.buckets WHERE id = 'gallery';
