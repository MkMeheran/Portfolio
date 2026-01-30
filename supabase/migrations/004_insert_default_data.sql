-- ============================================
-- INSERT DEFAULT SKILLS AND TOOLS DATA
-- Run this in Supabase SQL Editor
-- ============================================

-- Insert Skills (roles)
INSERT INTO skills (name, category, sub_skills, bg_color, has_certificates, display_order) VALUES
('Geospatial Data Analysis', 'technical', ARRAY['QGIS Mapping', 'Remote Sensing', 'Spatial Analysis', 'Cartography', 'GeoJSON/Shapefile'], 'emerald-500', true, 1),
('Data Analysis with SQL', 'technical', ARRAY['PostgreSQL', 'MySQL', 'Data Queries', 'Database Design', 'Data Cleaning'], 'orange-500', true, 2),
('Data Analysis with Python', 'technical', ARRAY['Pandas', 'NumPy', 'Matplotlib', 'Data Visualization', 'Automation'], 'yellow-500', true, 3),
('Full Stack Web Dev', 'technical', ARRAY['React/Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'REST APIs'], 'violet-500', true, 4),
('Word & Excel Mastery', 'office', ARRAY['Advanced Formulas', 'Pivot Tables', 'Document Formatting', 'Data Analysis', 'Macros'], 'blue-500', false, 5),
('Video Editing', 'creative', ARRAY['CapCut Pro', 'Color Grading', 'Motion Graphics', 'Audio Sync', 'Transitions'], 'pink-500', false, 6),
('Poster Design', 'creative', ARRAY['Canva Design', 'Typography', 'Layout', 'Color Theory', 'Branding'], 'rose-500', false, 7);

-- Insert Tools (for colorful Bento grid)
INSERT INTO tools (name, category, grid_size, proficiency, display_order) VALUES
-- Programming (large - 2x2)
('Python', 'programming', '2x2', 'expert', 1),
-- GIS (medium - 2x1)
('QGIS', 'gis', '2x1', 'expert', 2),
-- Small tools (1x1)
('ArcGIS', 'gis', '1x1', 'intermediate', 3),
('SQL', 'programming', '2x1', 'expert', 4),
('JavaScript', 'programming', '1x1', 'expert', 5),
('HTML', 'programming', '1x1', 'expert', 6),
('CSS', 'programming', '1x1', 'expert', 7),
-- Office Suite
('MS Excel', 'office', '2x1', 'expert', 8),
('MS Word', 'office', '1x1', 'advanced', 9),
('PowerPoint', 'office', '1x1', 'advanced', 10),
('SPSS', 'office', '1x1', 'intermediate', 11),
-- Design
('Canva', 'design', '2x1', 'expert', 12),
('CapCut', 'design', '1x1', 'expert', 13);

-- Done!
SELECT 'Default data inserted successfully!' AS status;
