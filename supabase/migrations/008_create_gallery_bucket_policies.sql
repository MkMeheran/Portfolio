-- Supabase Storage Bucket Setup
-- Run this in Supabase SQL Editor: https://app.supabase.com/project/YOUR_PROJECT/sql

-- 1. Create storage bucket (if not exists via Dashboard)
-- Note: Bucket creation is better done via Dashboard or API
-- Go to Storage → Create bucket → name: "gallery", public: true

-- 2. Create storage policies for 'gallery' bucket

-- Public read access
CREATE POLICY IF NOT EXISTS "Public read access to gallery"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');

-- Authenticated users can upload
CREATE POLICY IF NOT EXISTS "Authenticated users can upload to gallery"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'gallery' 
  AND auth.role() = 'authenticated'
);

-- Authenticated users can delete their files
CREATE POLICY IF NOT EXISTS "Authenticated users can delete from gallery"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'gallery' 
  AND auth.role() = 'authenticated'
);

-- Authenticated users can update their files
CREATE POLICY IF NOT EXISTS "Authenticated users can update in gallery"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'gallery' 
  AND auth.role() = 'authenticated'
);

-- Verify policies
SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%gallery%';
