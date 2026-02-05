# ✅ Setup Complete - Final Step

## Current Status:
- ✅ Gallery bucket exists and working
- ✅ Storage policies are set
- ⚠️ Certificate RLS needs one SQL run

## 🎯 Do This ONE Thing:

### Step 1: Open Supabase SQL Editor
```
https://supabase.com/dashboard/project/ozhlteeipldvznsvsavz/sql/new
```

### Step 2: Copy & Paste This SQL:
```sql
-- Fix Certificate RLS
DROP POLICY IF EXISTS "Public read access for certificates" ON certificates;
DROP POLICY IF EXISTS "Authenticated users can manage certificates" ON certificates;
DROP POLICY IF EXISTS "Anyone can insert certificates" ON certificates;

CREATE POLICY "Public read access for certificates" 
ON certificates FOR SELECT USING (true);

CREATE POLICY "Anyone can insert certificates"
ON certificates FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can update certificates"
ON certificates FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete certificates"
ON certificates FOR DELETE
USING (auth.role() = 'authenticated');
```

### Step 3: Click "Run" Button

### Step 4: Verify it worked:
```bash
node verify-setup.js
```

## ✅ After This:
- Certificates will save from admin panel
- Cover image upload works
- Education/Experience logos work
- Everything is ready!

## 🚀 Quick Test:
```bash
npm run dev
```

Then:
1. Go to `/admin/skills`
2. Click a skill
3. Click "Add Certificate"
4. Fill and save - it should work now!

---

**Note:** Gallery bucket আগে থেকেই আছে, তাই storage কাজ করবে এখনই!
