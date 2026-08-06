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

async function checkCommissions() {
  const { data: recComms } = await adminClient
    .from('recruiter_commissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  console.log("Recruiter commissions:", recComms);
}

checkCommissions();
