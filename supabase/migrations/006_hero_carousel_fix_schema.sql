-- ============================================
-- FIX HERO_CAROUSEL TABLE SCHEMA
-- Match actual client-side usage: text, emoji, line_number, order_index
-- ============================================

-- Drop the old table if it exists (backup data first if needed!)
-- Or manually migrate data from old columns to new ones

-- Recreate with correct schema
DROP TABLE IF EXISTS hero_carousel CASCADE;

CREATE TABLE hero_carousel (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,  -- Main text content
  emoji TEXT,  -- Emoji or icon character
  line_number INTEGER NOT NULL DEFAULT 1,  -- Which line (1 or 2)
  order_index INTEGER NOT NULL DEFAULT 0,  -- Display order within the line
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE hero_carousel ENABLE ROW LEVEL SECURITY;

-- Public read access
DROP POLICY IF EXISTS "Public read access for hero_carousel" ON hero_carousel;
CREATE POLICY "Public read access for hero_carousel" 
ON hero_carousel FOR SELECT 
USING (true);

-- Allow all operations (for admin panel and dashboard)
DROP POLICY IF EXISTS "Allow all operations on hero_carousel" ON hero_carousel;
CREATE POLICY "Allow all operations on hero_carousel"
ON hero_carousel FOR ALL
USING (true)
WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_hero_carousel_line_number ON hero_carousel(line_number);
CREATE INDEX IF NOT EXISTS idx_hero_carousel_order_index ON hero_carousel(order_index);
CREATE INDEX IF NOT EXISTS idx_hero_carousel_is_active ON hero_carousel(is_active);

-- Update trigger
DROP TRIGGER IF EXISTS update_hero_carousel_updated_at ON hero_carousel;
CREATE TRIGGER update_hero_carousel_updated_at
  BEFORE UPDATE ON hero_carousel
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO hero_carousel (text, emoji, line_number, order_index, is_active) VALUES
('Web Developer', '💻', 1, 1, true),
('Problem Solver', '🧩', 1, 2, true),
('UI/UX Designer', '🎨', 2, 1, true),
('Content Creator', '📱', 2, 2, true);
