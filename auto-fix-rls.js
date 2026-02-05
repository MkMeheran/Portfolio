const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const SUPABASE_URL = 'https://ozhlteeipldvznsvsavz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96aGx0ZWVpcGxkdnpuc3ZzYXZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NDQ0NDEsImV4cCI6MjA4NTMyMDQ0MX0.s4_Y-E4eZP_9AtJzWLkqr4oD1uHO6hN-DpOkmCLMihQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fixRLSPolicies() {
  console.log('\n=== Fixing Certificate RLS Policies ===\n');

  // The SQL to execute
  const sql = `
-- Drop existing policies
DROP POLICY IF EXISTS "Public read access for certificates" ON certificates;
DROP POLICY IF EXISTS "Authenticated users can manage certificates" ON certificates;
DROP POLICY IF EXISTS "Anyone can insert certificates" ON certificates;
DROP POLICY IF EXISTS "Authenticated users can update certificates" ON certificates;
DROP POLICY IF EXISTS "Authenticated users can delete certificates" ON certificates;

-- Policy 1: Public Read
CREATE POLICY "Public read access for certificates" 
ON certificates FOR SELECT 
USING (true);

-- Policy 2: Anyone can insert (for testing with anon key)
CREATE POLICY "Anyone can insert certificates"
ON certificates FOR INSERT
WITH CHECK (true);

-- Policy 3: Authenticated users can update
CREATE POLICY "Authenticated users can update certificates"
ON certificates FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Policy 4: Authenticated users can delete
CREATE POLICY "Authenticated users can delete certificates"
ON certificates FOR DELETE
USING (auth.role() = 'authenticated');
`;

  console.log('SQL Query to execute:');
  console.log('----------------------------------------');
  console.log(sql);
  console.log('----------------------------------------\n');

  console.log('❌ Cannot execute SQL directly from Node.js with anon key.');
  console.log('   Supabase requires service_role key or dashboard access for schema changes.\n');

  console.log('📋 COPY THIS SQL:\n');
  console.log('1. Open: https://supabase.com/dashboard/project/ozhlteeipldvznsvsavz/sql/new');
  console.log('2. Paste the SQL above');
  console.log('3. Click "Run"\n');

  // Test after policies are fixed
  console.log('After running the SQL, test with:');
  console.log('node verify-setup.js\n');

  // Save SQL to clipboard if possible
  try {
    const clipboardy = require('clipboardy');
    clipboardy.writeSync(sql);
    console.log('✅ SQL copied to clipboard! Just paste it in Supabase Dashboard.\n');
  } catch (e) {
    console.log('💡 Install clipboardy to auto-copy: npm install clipboardy\n');
  }
}

fixRLSPolicies().catch(console.error);
