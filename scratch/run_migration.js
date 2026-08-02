const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = envFile.split('\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=');
  if (key && val.length) acc[key.trim()] = val.join('=').trim().replace(/["'\r]/g, '');
  return acc;
}, {});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseKey) {
  console.error("SUPABASE_SERVICE_ROLE_KEY is required to run migrations.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  const migrationPath = path.join(__dirname, '../supabase/migrations/20260802_add_page_views.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');
  console.log('Running SQL Migration...');
  
  const { data, error } = await supabase.rpc('execute_sql', { sql_string: sql });
  if (error) {
    console.error('Migration failed:', error);
  } else {
    console.log('Migration completed successfully. Result:', data);
  }
}

runMigration();
