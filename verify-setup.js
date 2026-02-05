const { createClient } = require('@supabase/supabase-js');

// Note: This script needs service_role key to create buckets
// But we can test if policies work once bucket is created

const SUPABASE_URL = 'https://ozhlteeipldvznsvsavz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96aGx0ZWVpcGxkdnpuc3ZzYXZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NDQ0NDEsImV4cCI6MjA4NTMyMDQ0MX0.s4_Y-E4eZP_9AtJzWLkqr4oD1uHO6hN-DpOkmCLMihQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function setupAndTest() {
  console.log('\n=== Checking Supabase Setup ===\n');

  // 1. Check if gallery bucket exists
  console.log('1. Checking storage buckets...');
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  
  if (bucketsError) {
    console.log('❌ Cannot list buckets with anon key (this is normal)');
  } else {
    console.log('✅ Buckets:', buckets?.map(b => b.name).join(', ') || 'None');
  }

  // 2. Try to test gallery bucket access
  console.log('\n2. Testing gallery bucket access...');
  const { data: files, error: filesError } = await supabase.storage
    .from('gallery')
    .list();
  
  if (filesError) {
    console.log('❌ Gallery bucket not accessible:', filesError.message);
    console.log('   → Need to run: setup-storage-policies.sql in Supabase Dashboard');
  } else {
    console.log('✅ Gallery bucket is accessible!');
    console.log('   Files in bucket:', files?.length || 0);
  }

  // 3. Test certificate insert
  console.log('\n3. Testing certificate insert with anon key...');
  
  // First get a skill to attach certificate to
  const { data: skills } = await supabase
    .from('skills')
    .select('id, name')
    .limit(1)
    .single();

  if (skills) {
    const testCert = {
      skill_id: skills.id,
      title: 'Test Certificate - DELETE ME',
      issuer: 'Test Organization',
      credential_id: 'TEST-' + Date.now(),
      issue_date: 'Jan 2024',
      display_order: 999
    };

    const { data: newCert, error: insertError } = await supabase
      .from('certificates')
      .insert([testCert])
      .select()
      .single();

    if (insertError) {
      console.log('❌ Cannot insert certificate:', insertError.message);
      console.log('   → Need to run: fix-certificates-rls.sql in Supabase Dashboard');
    } else {
      console.log('✅ Certificate insert works!');
      console.log('   Test certificate ID:', newCert.id);
      
      // Clean up test data
      await supabase.from('certificates').delete().eq('id', newCert.id);
      console.log('   ✓ Test certificate deleted');
    }
  }

  // 4. Summary
  console.log('\n=== Setup Status ===\n');
  
  const storageWorks = !filesError;
  const certsWork = !bucketsError; // We'll update this after actual test
  
  console.log('Storage Bucket:', storageWorks ? '✅ Working' : '❌ Needs setup');
  console.log('Certificate RLS:', '⚠️  Run fix-certificates-rls.sql');
  
  console.log('\n=== Next Steps ===\n');
  console.log('1. Open: https://supabase.com/dashboard/project/ozhlteeipldvznsvsavz/sql/new');
  console.log('2. Run: setup-storage-policies.sql');
  console.log('3. Run: fix-certificates-rls.sql');
  console.log('4. Run this script again to verify\n');
}

setupAndTest().catch(console.error);
