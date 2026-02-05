# Quick Fix Guide - Portfolio Issues

## 🚀 What Was Fixed (Already Done)

### ✅ 1. Dialog Size Issues
- **Before:** Dialog was too small (max 512px) on desktop, cramped on mobile
- **After:** Dialog is now 700px wide on desktop with proper responsive padding
- **Files:** `skills-section.tsx`, `skills/page.tsx`

### ✅ 2. Missing Icons
- **Added:** Supply chain, logistics, warehouse, data science, data analyst, geospatial icons
- **Now supports:** 20+ new icon mappings for different skill categories
- **Files:** `skills-section.tsx`, `skills/page.tsx`

### ✅ 3. Education & Experience Logos
- **Before:** Only showed icons, never displayed logos
- **After:** Shows uploaded logos when available, falls back to icons
- **Files:** `page.tsx` (public)

---

## ⚠️ What YOU Need to Do

### 1. Create Supabase Storage Bucket (REQUIRED)

**Why:** Images can't upload because the storage bucket doesn't exist

**Steps:**
1. Go to https://app.supabase.com
2. Select your project: `ozhlteeipldvznsvsavz`
3. Click **Storage** in sidebar
4. Click **Create a new bucket**
5. Settings:
   - Name: `gallery`
   - Public: ✅ Check this box
   - Click **Create**

6. Go to **Storage > Policies** tab
7. Click **New Policy** (3 times for these 3 policies):

```sql
-- Policy 1: Public Read
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');

-- Policy 2: Authenticated Upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');

-- Policy 3: Authenticated Delete
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');
```

### 2. Re-Upload Cover Image

**Why:** Current cover URL points to external site, not your Supabase storage

**Steps:**
1. Login to admin panel: `/admin/profile`
2. Click **Images** tab
3. Under "Cover Image" click **আপলোড** (not "URL দিন")
4. Select your cover image file
5. Click **Save** at the top
6. Refresh home page to see new cover

### 3. Upload Education Logos

**Steps:**
1. Login to admin panel: `/admin/education`
2. Click ✏️ **Edit** on each education entry
3. Scroll to "Institution Logo"
4. Click **আপলোড** button
5. Select logo file (200x200px recommended)
6. Add Alt Text (e.g., "KUET Logo")
7. Click **Save**
8. Repeat for all education entries

### 4. Upload Experience Logos

**Steps:**
1. Login to admin panel: `/admin/experience`
2. Click ✏️ **Edit** on each experience entry
3. Scroll to "Company Logo"
4. Click **আপলোড** button
5. Select logo file (200x200px recommended)
6. Add Alt Text (e.g., "UdyomX Logo")
7. Click **Save**
8. Repeat for all experience entries

### 5. Add Certificates to Skills

**Why:** Certificate table is empty, RLS requires authentication to add

**Steps:**
1. **Make sure you're logged in** to admin panel
2. Go to `/admin/skills`
3. Click on any skill card to expand
4. Click **Add Certificate** button
5. Fill in:
   - Certificate Name (e.g., "Google Data Analytics")
   - Issuing Organization (e.g., "Google")
   - Credential ID (optional)
   - Credential URL (optional for verification)
   - Issue Date (e.g., "Jan 2024")
   - Upload certificate image (1200x850px recommended)
6. Click **Save**
7. Certificate will now show when users click "View Details" on that skill

---

## 🧪 Test Your Fixes

### Test Checklist:
```bash
# 1. Start dev server
npm run dev

# 2. Test in browser (http://localhost:3000)
- [ ] Homepage loads without errors
- [ ] Click any skill "View Details" - dialog should be wider on desktop
- [ ] Education section shows logos (if uploaded)
- [ ] Experience section shows logos (if uploaded)
- [ ] Skills page (/skills) shows certificates when added
- [ ] Cover image displays on homepage

# 3. Test mobile view (resize browser to < 640px)
- [ ] Dialog has proper padding on mobile
- [ ] All content is readable
- [ ] No horizontal scroll
```

---

## 🐛 Troubleshooting

### "Images won't upload"
**Solution:** Did you create the `gallery` bucket? Check step 1 above.

### "Certificates won't save"
**Solution:** Make sure you're **logged in** to admin panel. Certificate table requires authentication.

### "Logos still not showing"
**Solutions:**
1. Clear browser cache (Ctrl+Shift+R)
2. Check database: run `node test-database.js` to verify logo_url is saved
3. Verify image URL is accessible (copy URL and open in browser)

### "Cover image still shows old URL"
**Solution:** 
1. Create storage bucket first (step 1)
2. Re-upload via admin panel (step 2)
3. Don't use "URL দিন" option - use "আপলোড" to upload file

---

## 📁 File Reference

### Modified Files:
- ✅ `src/app/(public)/page.tsx` - Education/Experience logos
- ✅ `src/app/(public)/skills/page.tsx` - Dialog size, icons
- ✅ `src/components/sections/skills-section.tsx` - Dialog size, icons

### Database Check:
```bash
node test-database.js
```

### View Full Details:
See `BUG_FIXES_SUMMARY.md` for complete technical documentation.

---

## ✅ Done!

After completing steps 1-5 above, your portfolio will have:
- ✅ Working image uploads
- ✅ Logos displaying in education/experience
- ✅ Certificates showing in skills
- ✅ Better dialog UX on mobile and desktop
- ✅ Proper icons for all skill types

**Estimated Time:** 15-20 minutes

**Questions?** Check `BUG_FIXES_SUMMARY.md` for detailed explanations.
