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

async function restoreGhost() {
  const affiliateId = '8467001a-d59f-4925-988a-26d3b5903cd8';
  
  // Recreate Profile
  const resProf = await adminClient.from('profiles').insert({
    id: affiliateId,
    full_name: 'Ghost',
    email: 'bobby.charles93200@gmail.com',
    role: 'affiliate'
  });
  console.log('Profile restored:', resProf.error ? resProf.error : 'OK');

  // Recreate Affiliate
  const resAff = await adminClient.from('affiliates').insert({
    id: affiliateId,
    referral_code: 'GHOST',
    status: 'active',
    commission_rate: 20 // Default CPA
  });
  console.log('Affiliate restored:', resAff.error ? resAff.error : 'OK');
}

restoreGhost();
