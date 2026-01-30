-- Add icon field to tools table for Lucide icon names
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tools' AND column_name = 'icon') THEN
    ALTER TABLE tools ADD COLUMN icon TEXT;
  END IF;
END $$;

-- Add bg_color field if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tools' AND column_name = 'bg_color') THEN
    ALTER TABLE tools ADD COLUMN bg_color VARCHAR(50);
  END IF;
END $$;
