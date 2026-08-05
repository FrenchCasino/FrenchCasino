const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkFK() {
  const { data, error } = await supabase.rpc('get_foreign_keys');
  if (error) {
    // If no rpc, let's run a manual query using pg on service role? Supabase js doesn't allow arbitrary SQL.
    // Let's just try to delete an existing casino to see the exact error.
    console.log("Fallback to deleting a specific casino.");
  }
}

async function tryDeleteExisting() {
  const { data: casinos } = await supabase.from('casinos').select('id, name');
  console.log('Casinos:', casinos);
  // We won't actually delete, we will just simulate a failure by checking constraints.
}

tryDeleteExisting();
