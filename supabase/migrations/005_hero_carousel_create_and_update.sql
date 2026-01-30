-- ============================================
-- CREATE HERO_CAROUSEL TABLE IF NOT EXISTS
-- ============================================

CREATE TABLE IF NOT EXISTS hero_carousel (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  button_text VARCHAR(100),
  button_url TEXT,
  image_url TEXT,
  image_alt TEXT,
  icon TEXT,  -- Add icon field for lucide icon names
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add icon column if table already exists but column doesn't
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hero_carousel' AND column_name = 'icon') THEN
    ALTER TABLE hero_carousel ADD COLUMN icon TEXT;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE hero_carousel ENABLE ROW LEVEL SECURITY;

-- Public read access
DROP POLICY IF EXISTS "Public read access for hero_carousel" ON hero_carousel;
CREATE POLICY "Public read access for hero_carousel" 
ON hero_carousel FOR SELECT 
USING (true);

-- Allow all operations (for authenticated users via anon key, and service role for dashboard edits)
DROP POLICY IF EXISTS "Allow all operations on hero_carousel" ON hero_carousel;
CREATE POLICY "Allow all operations on hero_carousel"
ON hero_carousel FOR ALL
USING (true)
WITH CHECK (true);

-- Create index
CREATE INDEX IF NOT EXISTS idx_hero_carousel_display_order ON hero_carousel(display_order);
CREATE INDEX IF NOT EXISTS idx_hero_carousel_is_active ON hero_carousel(is_active);

-- Update trigger
DROP TRIGGER IF EXISTS update_hero_carousel_updated_at ON hero_carousel;
CREATE TRIGGER update_hero_carousel_updated_at
  BEFORE UPDATE ON hero_carousel
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
