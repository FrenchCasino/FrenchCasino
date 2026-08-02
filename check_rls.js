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

async function checkRLS() {
  const { data, error } = await supabase.rpc('execute_sql', { sql_string: `
    SELECT tablename, policyname, permissive, roles, cmd, qual, with_qual 
    FROM pg_policies 
    WHERE tablename = 'casino_clicks';
  `});
  console.log('RLS Policies casino_clicks:', data);
  console.log('Error:', error);
}
checkRLS();
