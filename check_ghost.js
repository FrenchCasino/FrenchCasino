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

async function checkGhost() {
  const affiliateId = '8467001a-d59f-4925-988a-26d3b5903cd8';
  
  // check if we can find them in auth users
  const { data: users } = await adminClient.auth.admin.listUsers();
  const user = users?.users?.find(u => u.id === affiliateId);
  console.log("Auth User:", user?.email);
  
  // check if any data left
  const { data: ref } = await adminClient.from('referral_links').select('*').eq('affiliate_id', affiliateId);
  console.log("Referral links:", ref);
  
  const { data: clicks } = await adminClient.from('clicks').select('*').eq('referral_link_id', ref?.[0]?.id);
  console.log("Clicks:", clicks?.length);
}

checkGhost();
