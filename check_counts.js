const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = envFile.split('\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=');
  if (key && val.length) acc[key.trim()] = val.join('=').trim().replace(/["'\r]/g, '');
  return acc;
}, {});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkClickCounts() {
  const { data, error } = await supabase.from('casino_clicks').select('affiliate_id');
  const counts = data.reduce((acc, click) => {
    acc[click.affiliate_id] = (acc[click.affiliate_id] || 0) + 1;
    return acc;
  }, {});
  console.log('Clicks per affiliate:', counts);
}
checkClickCounts();
