const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ozhlteeipldvznsvsavz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96aGx0ZWVpcGxkdnpuc3ZzYXZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NDQ0NDEsImV4cCI6MjA4NTMyMDQ0MX0.s4_Y-E4eZP_9AtJzWLkqr4oD1uHO6hN-DpOkmCLMihQ'
);

async function testDatabase() {
  console.log('\n=== Testing Database Connection ===\n');

  // 1. Test Skills Table
  console.log('1. Testing Skills Table:');
  const { data: skills, error: skillsError } = await supabase
    .from('skills')
    .select('id, name, has_certificates, display_order')
    .limit(3);
  
  if (skillsError) {
    console.error('Skills Error:', skillsError);
  } else {
    console.log('Skills:', JSON.stringify(skills, null, 2));
  }

  // 2. Test Certificates Table
  console.log('\n2. Testing Certificates Table:');
  const { data: certs, error: certsError } = await supabase
    .from('certificates')
    .select('*')
    .limit(5);
  
  if (certsError) {
    console.error('Certificates Error:', certsError);
  } else {
    console.log('Certificates Count:', certs?.length || 0);
    console.log('Certificates:', JSON.stringify(certs, null, 2));
  }

  // 3. Test Skills with Certificates Join
  console.log('\n3. Testing Skills with Certificates Join:');
  const { data: skillsWithCerts, error: joinError } = await supabase
    .from('skills')
    .select(`
      id,
      name,
      has_certificates,
      certificates (*)
    `)
    .limit(2);
  
  if (joinError) {
    console.error('Join Error:', joinError);
  } else {
    console.log('Skills with Certificates:', JSON.stringify(skillsWithCerts, null, 2));
  }

  // 4. Test Education Logo
  console.log('\n4. Testing Education Table:');
  const { data: education, error: eduError } = await supabase
    .from('education')
    .select('id, degree, institution, logo_url, logo_alt')
    .limit(3);
  
  if (eduError) {
    console.error('Education Error:', eduError);
  } else {
    console.log('Education:', JSON.stringify(education, null, 2));
  }

  // 5. Test Experience Logo
  console.log('\n5. Testing Experience Table:');
  const { data: experience, error: expError } = await supabase
    .from('experience')
    .select('id, title, organization, logo_url, logo_alt')
    .limit(3);
  
  if (expError) {
    console.error('Experience Error:', expError);
  } else {
    console.log('Experience:', JSON.stringify(experience, null, 2));
  }

  // 6. Test Profile Cover URL
  console.log('\n6. Testing Profile Cover URL:');
  const { data: profile, error: profileError } = await supabase
    .from('profile')
    .select('name, avatar_url, cover_url')
    .single();
  
  if (profileError) {
    console.error('Profile Error:', profileError);
  } else {
    console.log('Profile:', JSON.stringify(profile, null, 2));
  }

  // 7. Try to add a test certificate
  console.log('\n7. Testing Certificate Insert:');
  if (skills && skills.length > 0) {
    const testSkillId = skills[0].id;
    const { data: newCert, error: insertError } = await supabase
      .from('certificates')
      .insert([{
        skill_id: testSkillId,
        title: 'Test Certificate',
        issuer: 'Test Issuer',
        credential_id: 'TEST-123',
        issue_date: 'Jan 2024',
        display_order: 0
      }])
      .select()
      .single();
    
    if (insertError) {
      console.error('Insert Error:', insertError);
    } else {
      console.log('New Certificate Created:', JSON.stringify(newCert, null, 2));
      
      // Delete test certificate
      await supabase.from('certificates').delete().eq('id', newCert.id);
      console.log('Test certificate deleted.');
    }
  }

  console.log('\n=== Test Complete ===\n');
}

testDatabase();
