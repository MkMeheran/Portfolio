# Supabase Storage Bucket Creation Script
# Run this script to create the 'gallery' bucket

# ============================================
# STEP 1: Set your Supabase credentials
# ============================================
# Get these from: https://app.supabase.com/project/YOUR_PROJECT/settings/api

$SUPABASE_URL = "https://ozhlteeipldvznsvsavz.supabase.co"  # Your Supabase URL
$SUPABASE_SERVICE_KEY = "YOUR_SERVICE_ROLE_KEY_HERE"  # Replace with your service_role key (NOT anon key!)

# ============================================
# STEP 2: Create Storage Bucket
# ============================================

Write-Host "`n🚀 Creating 'gallery' storage bucket..." -ForegroundColor Cyan

$createBucketBody = @{
    name = "gallery"
    public = $true
    file_size_limit = 52428800  # 50 MB
    allowed_mime_types = @("image/*")
} | ConvertTo-Json

$headers = @{
    "apikey" = $SUPABASE_SERVICE_KEY
    "Authorization" = "Bearer $SUPABASE_SERVICE_KEY"
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri "$SUPABASE_URL/storage/v1/bucket" `
        -Method POST `
        -Headers $headers `
        -Body $createBucketBody
    
    Write-Host "✅ Bucket 'gallery' created successfully!" -ForegroundColor Green
}
catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "⚠️  Bucket 'gallery' already exists!" -ForegroundColor Yellow
    }
    else {
        Write-Host "❌ Error creating bucket: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}

# ============================================
# STEP 3: Set Storage Policies (via SQL)
# ============================================

Write-Host "`n🔐 Setting up storage policies..." -ForegroundColor Cyan

# You need to run these SQL commands in Supabase SQL Editor
# Go to: https://app.supabase.com/project/YOUR_PROJECT/sql

Write-Host @"

⚠️  IMPORTANT: Run these SQL commands in Supabase SQL Editor:
============================================================

-- 1. Public read access
CREATE POLICY IF NOT EXISTS "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');

-- 2. Authenticated users can upload
CREATE POLICY IF NOT EXISTS "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'gallery' 
  AND auth.role() = 'authenticated'
);

-- 3. Authenticated users can delete
CREATE POLICY IF NOT EXISTS "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'gallery' 
  AND auth.role() = 'authenticated'
);

-- 4. Authenticated users can update
CREATE POLICY IF NOT EXISTS "Authenticated users can update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'gallery' 
  AND auth.role() = 'authenticated'
);

============================================================

"@ -ForegroundColor Yellow

Write-Host "`n✅ Script completed!" -ForegroundColor Green
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Copy the SQL commands above" -ForegroundColor White
Write-Host "   2. Go to Supabase SQL Editor" -ForegroundColor White
Write-Host "   3. Paste and run the SQL commands" -ForegroundColor White
Write-Host "   4. Test image upload in your admin panel" -ForegroundColor White
