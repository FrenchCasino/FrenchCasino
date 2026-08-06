const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = envFile.split('\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=');
  if (key && val.length) acc[key.trim()] = val.join('=').trim().replace(/["'\r]/g, '');
  return acc;
}, {});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const adminClient = createClient(supabaseUrl, supabaseKey);

async function testAddComm() {
  const amount = 100;
  
  // Clean up first
  await adminClient.from('profiles').delete().in('id', ['11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222']);
  
  // Create a mock recruiter
  await adminClient.from('profiles').insert({
    id: '11111111-1111-1111-1111-111111111111',
    full_name: 'Test Recruiter',
    role: 'recruiter'
  });
  
  await adminClient.from('affiliates').insert({
    id: '11111111-1111-1111-1111-111111111111',
    referral_code: 'TEST-REC',
    status: 'active',
    total_earned: 0
  });

  // Create a mock affiliate with this recruiter
  await adminClient.from('profiles').insert({
    id: '22222222-2222-2222-2222-222222222222',
    full_name: 'Test Affiliate',
    role: 'affiliate'
  });
  
  await adminClient.from('affiliates').insert({
    id: '22222222-2222-2222-2222-222222222222',
    referral_code: 'TEST-AFF',
    status: 'active',
    total_earned: 0,
    recruiter_id: '11111111-1111-1111-1111-111111111111'
  });

  const affiliateId = '22222222-2222-2222-2222-222222222222';
  
  const { data: newComm } = await adminClient.from('commissions').insert({
    affiliate_id: affiliateId,
    montant: amount,
    statut: 'validated',
    periode: 'Test'
  }).select('id').single();

  const { data: affiliate } = await adminClient.from('affiliates').select('*').eq('id', affiliateId).single();
  
  const newTotal = Number(affiliate.total_earned) + Number(amount);
  await adminClient.from('affiliates').update({ total_earned: newTotal }).eq('id', affiliateId);

  const recruiterAmount = Number(amount) * 0.15;
  await adminClient.from('recruiter_commissions').insert({
    recruiter_id: affiliate.recruiter_id,
    affiliate_id: affiliateId,
    commission_id: newComm.id,
    montant: recruiterAmount
  });

  const { data: recruiterAff } = await adminClient.from('affiliates').select('*').eq('id', affiliate.recruiter_id).single();
  
  const newRecTotal = Number(recruiterAff.total_earned) + recruiterAmount;
  await adminClient.from('affiliates').update({ total_earned: newRecTotal }).eq('id', affiliate.recruiter_id);

  // Check balances
  const { data: finalAff } = await adminClient.from('affiliates').select('*').eq('id', affiliateId).single();
  const { data: finalRec } = await adminClient.from('affiliates').select('*').eq('id', affiliate.recruiter_id).single();
  
  console.log("Affiliate Balance:", finalAff.total_earned);
  console.log("Recruiter Balance:", finalRec.total_earned);

  // Cleanup
  await adminClient.from('profiles').delete().in('id', ['11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222']);
}

testAddComm().catch(console.error);
