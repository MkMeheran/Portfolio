# Supabase Storage Setup Instructions

## Required Storage Bucket

Your portfolio needs a **`gallery`** storage bucket in Supabase.

### Steps to Create Storage Bucket:

1. **Go to Supabase Dashboard**
   - Visit: https://app.supabase.com
   - Select your project

2. **Navigate to Storage**
   - Click "Storage" in left sidebar
   - Click "Create a new bucket"

3. **Create Bucket**
   - **Name:** `gallery`
   - **Public:** ✓ Enable (check this box)
   - **File size limit:** 50 MB (optional)
   - **Allowed MIME types:** Leave empty or add: `image/*`
   - Click "Create bucket"

4. **Set Bucket Policies (Important!)**
   
   After creating bucket, go to **Storage > Policies** and add:

   **Policy 1: Public Read Access**
   ```sql
   CREATE POLICY "Public read access"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'gallery');
   ```

   **Policy 2: Authenticated Upload**
   ```sql
   CREATE POLICY "Authenticated users can upload"
   ON storage.objects FOR INSERT
   WITH CHECK (
     bucket_id = 'gallery' 
     AND auth.role() = 'authenticated'
   );
   ```

   **Policy 3: Authenticated Delete**
   ```sql
   CREATE POLICY "Authenticated users can delete own files"
   ON storage.objects FOR DELETE
   USING (
     bucket_id = 'gallery' 
     AND auth.role() = 'authenticated'
   );
   ```

5. **Test Upload**
   - Try uploading an image from admin panel
   - Certificate add করার চেষ্টা করুন

## Alternative: Use Existing Bucket

If you already have a bucket (e.g., `portfolio-images`), you can update the code:

Open: `src/components/admin/image-uploader.tsx`

Change line 87 & 96:
```typescript
// FROM:
.from("gallery")

// TO:
.from("your-bucket-name")  // Replace with your actual bucket name
```

## Folder Structure in Bucket

The uploader will automatically create folders:
- `uploads/` - General images
- `certificates/` - Certificate images  
- `projects/` - Project thumbnails
- `avatars/` - Profile pictures

## Troubleshooting

### Error: "Bucket not found"
- ✓ Make sure bucket name is exactly `gallery`
- ✓ Check bucket is marked as "Public"
- ✓ Verify you're in the correct Supabase project

### Error: "New row violates row-level security policy"
- ✓ Add the storage policies mentioned above
- ✓ Make sure you're logged in as admin

### Error: "File size too large"
- ✓ Check bucket settings allow your file size
- ✓ Default limit is 5 MB in code
- ✓ Compress images before uploading

## Quick Test

After setup, test by:
1. Login to admin panel
2. Go to Skills → Add Certificate
3. Try uploading a certificate image
4. Should work now! ✅
