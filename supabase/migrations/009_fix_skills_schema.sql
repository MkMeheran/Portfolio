-- ============================================
-- FIX SKILLS TABLE SCHEMA TO MATCH ADMIN PANEL
-- ============================================

-- Clean up mixed schema state - remove old columns, keep new ones
DO $$ 
BEGIN
  -- Drop old columns if they exist (they're redundant with new ones)
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'skills' AND column_name = 'color') THEN
    ALTER TABLE skills DROP COLUMN color;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'skills' AND column_name = 'order_index') THEN
    ALTER TABLE skills DROP COLUMN order_index;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'skills' AND column_name = 'is_featured') THEN
    ALTER TABLE skills DROP COLUMN is_featured;
  END IF;
  
  -- Drop category_id and proficiency columns (not used in admin)
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'skills' AND column_name = 'category_id') THEN
    ALTER TABLE skills DROP CONSTRAINT IF EXISTS skills_category_id_fkey;
    ALTER TABLE skills DROP COLUMN category_id;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'skills' AND column_name = 'proficiency') THEN
    ALTER TABLE skills DROP COLUMN proficiency;
  END IF;
  
  -- Ensure new columns exist with correct defaults
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'skills' AND column_name = 'bg_color') THEN
    ALTER TABLE skills ADD COLUMN bg_color VARCHAR(50);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'skills' AND column_name = 'display_order') THEN
    ALTER TABLE skills ADD COLUMN display_order INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'skills' AND column_name = 'has_certificates') THEN
    ALTER TABLE skills ADD COLUMN has_certificates BOOLEAN DEFAULT FALSE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'skills' AND column_name = 'category') THEN
    ALTER TABLE skills ADD COLUMN category VARCHAR(255);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'skills' AND column_name = 'sub_skills') THEN
    ALTER TABLE skills ADD COLUMN sub_skills TEXT[] DEFAULT '{}';
  END IF;
  
END $$;

-- Verify the final schema has all needed columns
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'skills' AND column_name = 'id') THEN
    RAISE EXCEPTION 'Skills table missing id column';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'skills' AND column_name = 'name') THEN
    RAISE EXCEPTION 'Skills table missing name column';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'skills' AND column_name = 'bg_color') THEN
    RAISE EXCEPTION 'Skills table missing bg_color column';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'skills' AND column_name = 'display_order') THEN
    RAISE EXCEPTION 'Skills table missing display_order column';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'skills' AND column_name = 'icon') THEN
    RAISE EXCEPTION 'Skills table missing icon column';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'skills' AND column_name = 'description') THEN
    RAISE EXCEPTION 'Skills table missing description column';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'skills' AND column_name = 'has_certificates') THEN
    RAISE EXCEPTION 'Skills table missing has_certificates column';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'skills' AND column_name = 'sub_skills') THEN
    RAISE EXCEPTION 'Skills table missing sub_skills column';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'skills' AND column_name = 'category') THEN
    RAISE EXCEPTION 'Skills table missing category column';
  END IF;
END $$;
