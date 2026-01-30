-- Gallery Storage Policies
-- Run this in Supabase SQL Editor: https://app.supabase.com/project/ozhlteeipldvznsvsavz/sql/new

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public read gallery" ON storage.objects;
DROP POLICY IF EXISTS "Auth upload gallery" ON storage.objects;
DROP POLICY IF EXISTS "Auth delete gallery" ON storage.objects;
DROP POLICY IF EXISTS "Auth update gallery" ON storage.objects;

-- Public read access
CREATE POLICY "Public read gallery" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'gallery');

-- Authenticated users can upload
CREATE POLICY "Auth upload gallery" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');

-- Authenticated users can delete
CREATE POLICY "Auth delete gallery" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');

-- Authenticated users can update
CREATE POLICY "Auth update gallery" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');
