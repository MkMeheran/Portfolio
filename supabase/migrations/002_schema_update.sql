-- ============================================
-- COMPREHENSIVE SCHEMA UPDATE FOR ADMIN PANEL
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILE TABLE (already exists, update if needed)
-- ============================================
-- ALTER TABLE profile to add any missing columns
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profile' AND column_name = 'cover_url') THEN
    ALTER TABLE profile ADD COLUMN cover_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profile' AND column_name = 'whatsapp_url') THEN
    ALTER TABLE profile ADD COLUMN whatsapp_url TEXT;
  END IF;
END $$;

-- ============================================
-- 2. EDUCATION TABLE (update columns)
-- ============================================
DO $$ 
BEGIN
  -- Add new columns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'education' AND column_name = 'field_of_study') THEN
    ALTER TABLE education ADD COLUMN field_of_study TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'education' AND column_name = 'institution_short') THEN
    ALTER TABLE education ADD COLUMN institution_short VARCHAR(50);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'education' AND column_name = 'grade') THEN
    ALTER TABLE education ADD COLUMN grade VARCHAR(50);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'education' AND column_name = 'logo_alt') THEN
    ALTER TABLE education ADD COLUMN logo_alt TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'education' AND column_name = 'display_order') THEN
    ALTER TABLE education ADD COLUMN display_order INTEGER DEFAULT 0;
  END IF;
END $$;

-- ============================================
-- 3. EXPERIENCE TABLE (update columns)
-- ============================================
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'experience' AND column_name = 'company') THEN
    ALTER TABLE experience ADD COLUMN company VARCHAR(255);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'experience' AND column_name = 'company_url') THEN
    ALTER TABLE experience ADD COLUMN company_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'experience' AND column_name = 'employment_type') THEN
    ALTER TABLE experience ADD COLUMN employment_type VARCHAR(50);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'experience' AND column_name = 'skills_used') THEN
    ALTER TABLE experience ADD COLUMN skills_used TEXT[];
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'experience' AND column_name = 'logo_alt') THEN
    ALTER TABLE experience ADD COLUMN logo_alt TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'experience' AND column_name = 'display_order') THEN
    ALTER TABLE experience ADD COLUMN display_order INTEGER DEFAULT 0;
  END IF;
END $$;

-- ============================================
-- 4. PROJECTS TABLE (update columns)
-- ============================================
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'short_description') THEN
    ALTER TABLE projects ADD COLUMN short_description TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'technologies') THEN
    ALTER TABLE projects ADD COLUMN technologies TEXT[];
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'live_url') THEN
    ALTER TABLE projects ADD COLUMN live_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'github_url') THEN
    ALTER TABLE projects ADD COLUMN github_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'thumbnail_url') THEN
    ALTER TABLE projects ADD COLUMN thumbnail_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'thumbnail_alt') THEN
    ALTER TABLE projects ADD COLUMN thumbnail_alt TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'gallery_images') THEN
    ALTER TABLE projects ADD COLUMN gallery_images TEXT[];
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'is_active') THEN
    ALTER TABLE projects ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'display_order') THEN
    ALTER TABLE projects ADD COLUMN display_order INTEGER DEFAULT 0;
  END IF;
END $$;

-- ============================================
-- 5. SKILLS TABLE (update columns)
-- ============================================
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'skills' AND column_name = 'sub_skills') THEN
    ALTER TABLE skills ADD COLUMN sub_skills TEXT[];
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'skills' AND column_name = 'bg_color') THEN
    ALTER TABLE skills ADD COLUMN bg_color VARCHAR(50);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'skills' AND column_name = 'has_certificates') THEN
    ALTER TABLE skills ADD COLUMN has_certificates BOOLEAN DEFAULT FALSE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'skills' AND column_name = 'display_order') THEN
    ALTER TABLE skills ADD COLUMN display_order INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'skills' AND column_name = 'category') THEN
    ALTER TABLE skills ADD COLUMN category VARCHAR(100);
  END IF;
END $$;

-- ============================================
-- 6. CERTIFICATES TABLE (new table)
-- ============================================
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  
  -- Certificate Info
  title VARCHAR(255) NOT NULL,
  issuer VARCHAR(255),
  credential_id VARCHAR(255),
  credential_url TEXT,
  
  -- Image
  image_url TEXT,
  image_alt TEXT,
  
  -- Dates
  issue_date VARCHAR(50),
  expiry_date VARCHAR(50),
  
  -- Display
  display_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. TOOLS TABLE (update columns)
-- ============================================
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tools' AND column_name = 'icon_url') THEN
    ALTER TABLE tools ADD COLUMN icon_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tools' AND column_name = 'icon_alt') THEN
    ALTER TABLE tools ADD COLUMN icon_alt TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tools' AND column_name = 'url') THEN
    ALTER TABLE tools ADD COLUMN url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tools' AND column_name = 'grid_size') THEN
    ALTER TABLE tools ADD COLUMN grid_size VARCHAR(10) DEFAULT '1x1';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tools' AND column_name = 'display_order') THEN
    ALTER TABLE tools ADD COLUMN display_order INTEGER DEFAULT 0;
  END IF;
END $$;

-- ============================================
-- 8. GALLERY TABLE (update columns)
-- ============================================
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gallery' AND column_name = 'description') THEN
    ALTER TABLE gallery ADD COLUMN description TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gallery' AND column_name = 'image_alt') THEN
    ALTER TABLE gallery ADD COLUMN image_alt TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gallery' AND column_name = 'display_order') THEN
    ALTER TABLE gallery ADD COLUMN display_order INTEGER DEFAULT 0;
  END IF;
END $$;

-- ============================================
-- 9. HERO_CAROUSEL TABLE (update columns)
-- ============================================
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hero_carousel' AND column_name = 'title') THEN
    ALTER TABLE hero_carousel ADD COLUMN title TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hero_carousel' AND column_name = 'subtitle') THEN
    ALTER TABLE hero_carousel ADD COLUMN subtitle TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hero_carousel' AND column_name = 'description') THEN
    ALTER TABLE hero_carousel ADD COLUMN description TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hero_carousel' AND column_name = 'button_text') THEN
    ALTER TABLE hero_carousel ADD COLUMN button_text VARCHAR(100);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hero_carousel' AND column_name = 'button_url') THEN
    ALTER TABLE hero_carousel ADD COLUMN button_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hero_carousel' AND column_name = 'image_url') THEN
    ALTER TABLE hero_carousel ADD COLUMN image_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hero_carousel' AND column_name = 'image_alt') THEN
    ALTER TABLE hero_carousel ADD COLUMN image_alt TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hero_carousel' AND column_name = 'display_order') THEN
    ALTER TABLE hero_carousel ADD COLUMN display_order INTEGER DEFAULT 0;
  END IF;
END $$;

-- ============================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on certificates
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Public read access for certificates (drop first to make idempotent)
DROP POLICY IF EXISTS "Public read access for certificates" ON certificates;
CREATE POLICY "Public read access for certificates" 
ON certificates FOR SELECT 
USING (true);

-- Authenticated users can manage certificates
DROP POLICY IF EXISTS "Authenticated users can manage certificates" ON certificates;
CREATE POLICY "Authenticated users can manage certificates"
ON certificates FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- 11. CREATE INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_certificates_skill_id ON certificates(skill_id);
CREATE INDEX IF NOT EXISTS idx_certificates_display_order ON certificates(display_order);
CREATE INDEX IF NOT EXISTS idx_skills_display_order ON skills(display_order);
CREATE INDEX IF NOT EXISTS idx_education_display_order ON education(display_order);
CREATE INDEX IF NOT EXISTS idx_experience_display_order ON experience(display_order);
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON projects(display_order);
CREATE INDEX IF NOT EXISTS idx_tools_display_order ON tools(display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_display_order ON gallery(display_order);
CREATE INDEX IF NOT EXISTS idx_hero_carousel_display_order ON hero_carousel(display_order);

-- ============================================
-- 12. UPDATE FUNCTION FOR TIMESTAMPS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_certificates_updated_at ON certificates;
CREATE TRIGGER update_certificates_updated_at
    BEFORE UPDATE ON certificates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Done!
SELECT 'Migration completed successfully!' AS status;
