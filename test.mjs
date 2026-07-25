import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://pxbngvmnfsxvbmvxnbsq.supabase.co', 'sb_publishable_fZTXmdvRiz7jKprwItGPfg_MkHaqKy2');

async function run() {
  const { data, error } = await supabase
    .from('tickets')
    .select(`
      *,
      affiliates (
        profiles (
          full_name,
          email
        )
      )
    `)
    .order('created_at', { ascending: false });

  console.log('Error:', error);
  console.log('Data:', JSON.stringify(data, null, 2));
}

run();
