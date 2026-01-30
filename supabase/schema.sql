-- ============================================
-- PORTFOLIO DATABASE SCHEMA
-- For: Mokammel Morshed (Meheran) Portfolio
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILE (Single row - site owner info)
-- ============================================
CREATE TABLE IF NOT EXISTS profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(500),
  bio TEXT,
  location VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  avatar_url TEXT,
  cover_url TEXT,
  
  -- Social Links
  github_url TEXT,
  linkedin_url TEXT,
  facebook_url TEXT,
  twitter_url TEXT,
  whatsapp_url TEXT,
  
  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. EDUCATION
-- ============================================
CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  degree VARCHAR(255) NOT NULL,
  institution VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  field VARCHAR(255),
  gpa DECIMAL(3,2),
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  achievements TEXT[], -- Array of achievements
  description TEXT,
  logo_url TEXT,
  order_index INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. EXPERIENCE
-- ============================================
CREATE TABLE IF NOT EXISTS experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  organization VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  type VARCHAR(50) DEFAULT 'work', -- work, volunteer, internship
  description TEXT,
  responsibilities TEXT[], -- Array of responsibilities
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  logo_url TEXT,
  website_url TEXT,
  order_index INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. PROJECTS
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  content TEXT, -- Full markdown content
  category VARCHAR(50) NOT NULL, -- gis, web, ai, design
  tech_stack TEXT[], -- Array of technologies
  demo_url TEXT,
  repo_url TEXT,
  image_url TEXT,
  gallery_urls TEXT[], -- Array of gallery images
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  order_index INTEGER DEFAULT 0,
  
  -- Stats
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. SKILLS (with categories)
-- ============================================
CREATE TABLE IF NOT EXISTS skill_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(50),
  order_index INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  category_id UUID REFERENCES skill_categories(id) ON DELETE SET NULL,
  proficiency INTEGER DEFAULT 50 CHECK (proficiency >= 0 AND proficiency <= 100),
  icon VARCHAR(50),
  color VARCHAR(50),
  description TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. TOOLS (Software/Tools used)
-- ============================================
CREATE TABLE IF NOT EXISTS tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50), -- Icon name from react-icons or lucide
  bg_color VARCHAR(50), -- Background color class
  text_color VARCHAR(50), -- Text color class
  category VARCHAR(50), -- programming, gis, design, productivity
  proficiency INTEGER DEFAULT 50,
  is_featured BOOLEAN DEFAULT TRUE,
  order_index INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. INTERESTS/HOBBIES
-- ============================================
CREATE TABLE IF NOT EXISTS interests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50),
  color VARCHAR(50),
  description TEXT,
  order_index INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. GALLERY IMAGES
-- ============================================
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255),
  image_url TEXT NOT NULL,
  alt_text VARCHAR(255),
  category VARCHAR(50), -- profile, project, certificate, general
  order_index INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 9. HERO CAROUSEL ITEMS
-- ============================================
CREATE TABLE IF NOT EXISTS hero_carousel (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text VARCHAR(100) NOT NULL,
  emoji VARCHAR(10),
  line_number INTEGER DEFAULT 1, -- 1 or 2 for two-line carousel
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 10. SITE SETTINGS (Key-Value store)
-- ============================================
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  type VARCHAR(20) DEFAULT 'string', -- string, number, boolean, json
  description TEXT,
  
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INSERT DEFAULT DATA
-- ============================================

-- Profile
INSERT INTO profile (name, title, subtitle, bio, location, email, avatar_url, github_url, linkedin_url, facebook_url, twitter_url, whatsapp_url)
VALUES (
  'Mokammel Morshed',
  'Urban & Regional Planning Student',
  'KUET | Student ID: 2417012',
  'I bring together urban planning and future-focused technology. My work blends spatial thinking with practical skills in AI — including generative tools (ChatGPT, Gemini), computer vision, automation, and data-driven workflows.

Alongside this, I have experience in modern Web Development, UI design, SEO, content creation, and productivity systems. I''m also skilled with tools like React, Canva, Photoshop, Word, Excel, and Notion.

Through my portfolio, I aim to showcase not just what I''ve learned, but also how I apply technology to solve real-world planning and communication challenges.',
  'Feni, Bangladesh',
  'mdmokammelmorshed@gmail.com',
  'https://meheran-portfolio.vercel.app/assets/Meheran.jpg',
  'https://github.com/meheran216',
  'https://www.linkedin.com/in/mokammel-morshed-59108a366/',
  'https://www.facebook.com/Meheran216/',
  'https://twitter.com/Meheran_3005',
  'https://wa.link/rqd8sv'
);

-- Education
INSERT INTO education (degree, institution, location, field, gpa, start_date, end_date, is_current, achievements, order_index) VALUES
('B.URP (Bachelor of Urban & Regional Planning)', 'Khulna University of Engineering & Technology (KUET)', 'Khulna, Bangladesh', 'Urban & Regional Planning', NULL, '2025-08-01', NULL, TRUE, ARRAY['Student ID: 2417012'], 1),
('HSC 2024', 'Bangladesh Chemical Industries Corporation College', 'Dhaka, Bangladesh', 'Science', 5.00, '2022-02-01', '2024-06-30', FALSE, ARRAY['GPA 5.00'], 2),
('SSC 2022', 'Ataturk Govt. Model High School', 'Feni, Bangladesh', 'Science', 5.00, '2017-01-01', '2021-07-31', FALSE, ARRAY['GPA 5.00'], 3),
('JSC 2019', 'Ataturk Govt. Model High School', 'Feni, Bangladesh', 'General', 4.56, '2017-01-01', '2019-11-30', FALSE, ARRAY['GPA 4.56'], 4);

-- Experience
INSERT INTO experience (title, organization, location, type, description, start_date, end_date, is_current, order_index) VALUES
('Founder', 'UdyomX ORG', 'Dhaka, Bangladesh', 'work', 'Building exceptional digital experiences with modern technologies and creative solutions. Web Development, UI/UX Design, Consulting, Custom Solutions.', '2025-01-01', NULL, TRUE, 1),
('Skill Development (Self-Learning)', 'Self Learning', 'Remote', 'work', 'Web Development: HTML, CSS, JavaScript, React, SEO. Design & Creative Tools: Photoshop, Illustrator. Writing & Productivity: Microsoft Word, Excel, PowerPoint.', '2025-04-01', '2025-09-30', FALSE, 2),
('Language Learning (IELTS & German A1)', 'Self Learning', 'Remote', 'work', 'IELTS Preparation: Test strategies, academic writing, speaking practice. German A1: Alphabet, basic grammar, everyday phrases, listening exercises.', '2025-05-01', '2025-09-30', FALSE, 3);

-- Skill Categories
INSERT INTO skill_categories (name, slug, description, icon, color, order_index) VALUES
('GIS & Mapping', 'gis', 'Geographic Information System analysis and mapping', 'Globe', 'emerald', 1),
('Web Development', 'web', 'Full-stack web development skills', 'Code', 'violet', 2),
('Data Analysis', 'data', 'Data processing and analysis', 'Database', 'orange', 3),
('Office & Productivity', 'office', 'Microsoft Office and productivity tools', 'FileText', 'blue', 4),
('Design', 'design', 'Graphic and UI/UX design', 'Palette', 'pink', 5);

-- Skills
INSERT INTO skills (name, category_id, proficiency, icon, is_featured, order_index) VALUES
('QGIS', (SELECT id FROM skill_categories WHERE slug = 'gis'), 85, 'SiQgis', TRUE, 1),
('ArcGIS Pro', (SELECT id FROM skill_categories WHERE slug = 'gis'), 80, 'FaMapMarkedAlt', TRUE, 2),
('Leaflet', (SELECT id FROM skill_categories WHERE slug = 'gis'), 75, 'FaGlobe', TRUE, 3),
('Remote Sensing', (SELECT id FROM skill_categories WHERE slug = 'gis'), 70, 'FaSatellite', FALSE, 4),

('React/Next.js', (SELECT id FROM skill_categories WHERE slug = 'web'), 75, 'SiReact', TRUE, 1),
('TypeScript', (SELECT id FROM skill_categories WHERE slug = 'web'), 70, 'SiTypescript', TRUE, 2),
('JavaScript', (SELECT id FROM skill_categories WHERE slug = 'web'), 80, 'SiJavascript', TRUE, 3),
('HTML/CSS', (SELECT id FROM skill_categories WHERE slug = 'web'), 90, 'SiHtml5', TRUE, 4),
('Tailwind CSS', (SELECT id FROM skill_categories WHERE slug = 'web'), 85, 'SiTailwindcss', TRUE, 5),

('Python', (SELECT id FROM skill_categories WHERE slug = 'data'), 70, 'SiPython', TRUE, 1),
('SQL', (SELECT id FROM skill_categories WHERE slug = 'data'), 75, 'FaDatabase', TRUE, 2),
('Data Visualization', (SELECT id FROM skill_categories WHERE slug = 'data'), 70, 'FaChartBar', FALSE, 3),

('Microsoft Excel', (SELECT id FROM skill_categories WHERE slug = 'office'), 90, 'FaFileExcel', TRUE, 1),
('Microsoft Word', (SELECT id FROM skill_categories WHERE slug = 'office'), 90, 'FaFileWord', TRUE, 2),
('PowerPoint', (SELECT id FROM skill_categories WHERE slug = 'office'), 85, 'FaFilePowerpoint', TRUE, 3),

('Canva', (SELECT id FROM skill_categories WHERE slug = 'design'), 85, 'SiCanva', TRUE, 1),
('Photoshop', (SELECT id FROM skill_categories WHERE slug = 'design'), 70, 'SiAdobephotoshop', FALSE, 2),
('Video Editing', (SELECT id FROM skill_categories WHERE slug = 'design'), 65, 'FaVideo', FALSE, 3);

-- Tools
INSERT INTO tools (name, icon, bg_color, text_color, category, proficiency, is_featured, order_index) VALUES
('Python', 'SiPython', 'bg-yellow-400', 'text-stone-900', 'programming', 70, TRUE, 1),
('JavaScript', 'SiJavascript', 'bg-yellow-300', 'text-stone-900', 'programming', 80, TRUE, 2),
('TypeScript', 'SiTypescript', 'bg-blue-500', 'text-white', 'programming', 70, TRUE, 3),
('React', 'SiReact', 'bg-cyan-400', 'text-stone-900', 'programming', 75, TRUE, 4),
('Next.js', 'SiNextdotjs', 'bg-stone-900', 'text-white', 'programming', 75, TRUE, 5),
('Tailwind', 'SiTailwindcss', 'bg-teal-400', 'text-stone-900', 'programming', 85, TRUE, 6),
('Node.js', 'FaNodeJs', 'bg-green-500', 'text-white', 'programming', 65, TRUE, 7),
('QGIS', 'SiQgis', 'bg-green-400', 'text-stone-900', 'gis', 85, TRUE, 8),
('ArcGIS', 'FaMapMarkedAlt', 'bg-blue-600', 'text-white', 'gis', 80, TRUE, 9),
('SQL', 'FaDatabase', 'bg-orange-500', 'text-white', 'programming', 75, TRUE, 10),
('HTML', 'SiHtml5', 'bg-orange-600', 'text-white', 'programming', 90, TRUE, 11),
('CSS', 'SiCss3', 'bg-blue-500', 'text-white', 'programming', 90, TRUE, 12),
('Excel', 'FaFileExcel', 'bg-green-600', 'text-white', 'productivity', 90, TRUE, 13),
('Word', 'FaFileWord', 'bg-blue-700', 'text-white', 'productivity', 90, TRUE, 14),
('PowerPoint', 'FaFilePowerpoint', 'bg-red-500', 'text-white', 'productivity', 85, TRUE, 15),
('Canva', 'SiCanva', 'bg-violet-500', 'text-white', 'design', 85, TRUE, 16),
('CapCut', 'FaVideo', 'bg-pink-500', 'text-white', 'design', 65, TRUE, 17);

-- Interests
INSERT INTO interests (name, icon, color, order_index) VALUES
('Coding', 'Code', 'bg-violet-500', 1),
('GIS & Maps', 'Globe', 'bg-emerald-500', 2),
('Photography', 'Camera', 'bg-pink-500', 3),
('Gaming', 'Gamepad2', 'bg-blue-500', 4),
('Learning', 'BookOpen', 'bg-amber-500', 5),
('Travel', 'Plane', 'bg-cyan-500', 6),
('Coffee', 'Coffee', 'bg-orange-500', 7),
('Music', 'Music', 'bg-rose-500', 8);

-- Hero Carousel - Line 1
INSERT INTO hero_carousel (text, emoji, line_number, order_index) VALUES
('Urban Planner', '🏙️', 1, 1),
('GIS Analyst', '🗺️', 1, 2),
('Web Developer', '💻', 1, 3),
('AI Enthusiast', '🤖', 1, 4),
('UI/UX Designer', '🎨', 1, 5),
('Content Creator', '✍️', 1, 6),
('Problem Solver', '🧠', 1, 7),
('Tech Explorer', '🚀', 1, 8);

-- Hero Carousel - Line 2
INSERT INTO hero_carousel (text, emoji, line_number, order_index) VALUES
('KUET Student', '🎓', 2, 1),
('HSC GPA 5.00', '⭐', 2, 2),
('SSC GPA 5.00', '⭐', 2, 3),
('UdyomX Founder', '💼', 2, 4),
('Self Learner', '📚', 2, 5),
('Germany Aspirant', '🇩🇪', 2, 6),
('IELTS Prep', '📝', 2, 7),
('German A1', '🗣️', 2, 8);

-- Gallery
INSERT INTO gallery (title, image_url, alt_text, category, order_index) VALUES
('Profile Photo', 'https://meheran-portfolio.vercel.app/assets/Meheran.jpg', 'Mokammel Morshed - Profile', 'profile', 1),
('URP Work', 'https://meheran-portfolio.vercel.app/assets/urp.webp', 'Urban & Regional Planning Work', 'project', 2),
('Student Project', 'https://meheran-portfolio.vercel.app/assets/StudentInformationWebsite.jpg', 'Student Information Website', 'project', 3),
('Cover Design', 'https://meheran-portfolio.vercel.app/assets/URP_Cover_Image.jpg', 'URP Cover Design', 'design', 4);

-- Projects
INSERT INTO projects (title, slug, description, content, category, tech_stack, demo_url, repo_url, image_url, is_featured, is_published, order_index) VALUES
(
  'Simple WebGIS Dashboard',
  'simple-webgis-dashboard',
  'My first WebGIS project - from QGIS struggles to Leaflet maps. A dual-map viewer showing Bangladesh administrative data with optimized performance.',
  '## Building My First WebGIS Project

This was my very first project diving into the world of GIS. The journey took me from understanding raw shapefiles in QGIS to building an interactive web map using Leaflet JS.

### Key Learnings:
- Layer management & Selection
- Attribute Table manipulation & Filtering
- Processing tools (Refactor Fields)
- Importance of EPSG:4326 & GeoJSON
- File optimization with Mapshaper',
  'gis',
  ARRAY['QGIS', 'Leaflet', 'JavaScript', 'HTML', 'CSS', 'GeoJSON'],
  'https://mkmeheran.github.io/Urban_Web_Dashboard_Project001/',
  'https://github.com/MkMeheran/Urban_Web_Dashboard_Project001.git',
  'https://nzeglwdodpurbbygaqpf.supabase.co/storage/v1/object/public/gallery/Screenshot_2025_12_24_093423_1766568324831_xf4keb.png',
  TRUE, TRUE, 1
),
(
  'Responsive Student Portfolio',
  'responsive-student-portfolio',
  'A fully responsive personal portfolio website built using HTML, CSS, and JavaScript. Showcases student achievements, projects, and contact information.',
  '## Student Portfolio Website

Built a responsive portfolio to showcase academic and project achievements.

### Features:
- Mobile-first responsive design
- Clean and modern UI
- Project showcase section
- Contact form integration',
  'web',
  ARRAY['HTML', 'CSS', 'JavaScript'],
  'https://meheran216.github.io/Kueturp/',
  'https://github.com/meheran216/Kueturp',
  'https://meheran-portfolio.vercel.app/assets/StudentInformationWebsite.jpg',
  TRUE, TRUE, 2
),
(
  'Urban Heat Map Analysis',
  'urban-heat-map',
  'Uses remote sensing and interactive web maps to analyze urban heat island patterns and support climate-resilient urban planning.',
  '## Urban Heat Island Analysis

This project uses remote sensing data to analyze urban heat island effects.

### Methodology:
- Landsat thermal imagery processing
- Temperature distribution mapping
- Climate impact assessment',
  'gis',
  ARRAY['Raster Analysis', 'JavaScript', 'Web Mapping', 'Remote Sensing'],
  NULL,
  NULL,
  'https://meheran-portfolio.vercel.app/assets/urp.webp',
  TRUE, TRUE, 3
),
(
  'UdyomX ORG Platform',
  'udyomx-org',
  'A modern organization website featuring project showcases, blog system, and services pages. Built with Next.js and integrated with Supabase.',
  '## UdyomX Organization Website

Building exceptional digital experiences with modern technologies.

### Features:
- Project portfolio showcase
- Blog management system
- Service listings
- Contact integration',
  'web',
  ARRAY['Next.js', 'React', 'Supabase', 'Tailwind CSS', 'TypeScript'],
  'https://udyomxorg.vercel.app/',
  'https://github.com/MkMeheran',
  NULL,
  TRUE, TRUE, 4
);

-- Site Settings
INSERT INTO site_settings (key, value, type, description) VALUES
('site_name', 'Meheran Portfolio', 'string', 'Website name'),
('site_tagline', 'Urban Planner | GIS Analyst | Full-Stack Developer', 'string', 'Site tagline'),
('resume_url', '/cv.pdf', 'string', 'Resume/CV file URL'),
('google_analytics_id', '', 'string', 'Google Analytics tracking ID'),
('contact_email', 'mdmokammelmorshed@gmail.com', 'string', 'Contact email address');

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_carousel ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "Public read access" ON profile FOR SELECT USING (true);
CREATE POLICY "Public read access" ON education FOR SELECT USING (true);
CREATE POLICY "Public read access" ON experience FOR SELECT USING (true);
CREATE POLICY "Public read access" ON projects FOR SELECT USING (is_published = true);
CREATE POLICY "Public read access" ON skill_categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read access" ON tools FOR SELECT USING (true);
CREATE POLICY "Public read access" ON interests FOR SELECT USING (true);
CREATE POLICY "Public read access" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public read access" ON hero_carousel FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON site_settings FOR SELECT USING (true);

-- Admin full access (authenticated users)
CREATE POLICY "Admin full access" ON profile FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON education FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON experience FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON skill_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON tools FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON interests FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON gallery FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON hero_carousel FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_featured ON projects(is_featured);
CREATE INDEX idx_projects_published ON projects(is_published);
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_skills_category ON skills(category_id);
CREATE INDEX idx_education_order ON education(order_index);
CREATE INDEX idx_experience_order ON experience(order_index);
CREATE INDEX idx_hero_carousel_line ON hero_carousel(line_number);

-- ============================================
-- FUNCTIONS FOR AUTO-UPDATING
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_profile_updated_at BEFORE UPDATE ON profile
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON education
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experience_updated_at BEFORE UPDATE ON experience
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
