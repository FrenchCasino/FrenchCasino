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

async function testDelete() {
  const { data: affs } = await adminClient.from('affiliates').select('id').limit(1);
  if (!affs || affs.length === 0) return console.log("No affiliates");
  const affiliateId = affs[0].id;
  console.log("Trying to delete:", affiliateId);

  // Manual cleanup as in route.ts
  const res1 = await adminClient.from('casino_clicks').delete().eq('affiliate_id', affiliateId);
  if (res1.error) console.log("error1", res1.error);
  
  const res2 = await adminClient.from('recruiter_commissions').delete().eq('affiliate_id', affiliateId);
  if (res2.error) console.log("error2", res2.error);
  
  const res3 = await adminClient.from('recruiter_commissions').delete().eq('recruiter_id', affiliateId);
  if (res3.error) console.log("error3", res3.error);
  
  const res4 = await adminClient.from('commissions').delete().eq('affiliate_id', affiliateId);
  if (res4.error) console.log("error4", res4.error);
  
  const res5 = await adminClient.from('notifications').delete().eq('user_id', affiliateId);
  if (res5.error) console.log("error5", res5.error);

  const resAff = await adminClient.from('affiliates').delete().eq('id', affiliateId);
  if (resAff.error) console.log("errorAff", resAff.error);

  const resProf = await adminClient.from('profiles').delete().eq('id', affiliateId);
  if (resProf.error) console.log("errorProf", resProf.error);
}

testDelete();
